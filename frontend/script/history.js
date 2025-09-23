//検索機能
function searchRecords() {
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const rows = document.querySelectorAll('#records-tbody tr');
    let foundRecords = 0;

    rows.forEach(row => {
        const dateCell = row.cells[0].textContent;
        const typeCell = row.cells[1].textContent;
        const moneyCell = row.cells[2].textContent;
        const categoryCell = row.cells[3].textContent;
        const memoCell = row.cells[4].textContent;

        let showRow = true;

        //キーワード検索
        if (keyword && !(dateCell.includes(keyword) || typeCell.includes(keyword) ||
            moneyCell.includes(keyword) || categoryCell.includes(keyword) ||
            memoCell.includes(keyword))) {
            showRow = false;
        }

        //開始日検索
        if (startDate && dateCell < startDate) {
            showRow = false;
        }

        //終了日検索
        if (endDate && dateCell > endDate) {
            showRow = false;
        }

        //タイプ検索
        if (type) {
            const typeText = type === 'received' ? 'もらった' : 'つかった';
            if (typeCell !== typeText) {
                showRow = false;
            }
        }

        //カテゴリー検索
        if (category && categoryCell !== '') {
            //HTMLのselect要素のvalueと実際のテーブルデータの対応
            const categoryMapping = {
                'pocket-money': 'おこづかい',
                'work': 'おてつだい',
                'new-years-gift': 'お年玉',
                'gift': 'プレゼント',
                'sweets': 'おかし',
                'food': 'ごはん',
                'toy': 'おもちゃ',
                'game': 'ゲーム',
                'book': '本',
                'other': 'それいがい',
            };

            const expectedCategory = categoryMapping[category];
            if (categoryCell !== expectedCategory) {
                showRow = false;
            }
        }

        //表示・非表示の最終判断
        if (showRow) {
            row.style.display = '';
            foundRecords++;
        } else {
            row.style.display = 'none';
        }
    });

}

//編集機能
function editRecord(id) {
    //編集画面への遷移
    location.href = `edit.html?id=${id}`;
}

//削除機能
function deleteRecord(id) {
    //削除確認ポップアップを表示
    showDeleteConfirmPopup(id);
}
//クリア機能
function clearSearch() {
    document.getElementById('keyword').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('type').value = '';
    document.getElementById('category').value = '';

    //全件表示に戻す
    const rows = document.querySelectorAll('#records-tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });

    //検索結果の件数表示をリセット
    //エラーメッセージを非表示
    document.getElementById('error-message').style.display = 'none';
}
//データベースから記録を取得
async function fetchRecordsFromDatabase() {
    try {
        //セッションからuserIdを取得
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.userId) {
            throw new Error('ユーザーじょうほうが見つからないよ。もう1回ログインしてね。');
        }

        //API呼び出し
        const response = await fetch(`http://localhost:8080/kids/user/${user.userId}/records`);

        if (!response.ok) {
            throw new Error('きろくがよみこめなかったよ');
        }

        const data = await response.json(); //レスポンス全体を取得

        if (data.success && Array.isArray(data.records)) {
            return data.records; //配列を返す
        } else {
            throw new Error('データの形式が正しくありません')
        }

    } catch (error) {
        console.error('記録取得エラー:', error);
        throw error;
    }
}

//残高計算と表示
function updateBalanceFromRecords(records) {
    let balance = 0;

    records.forEach(record => {
        if (record.recordType === 'received') {
            balance += record.amount;
        } else {
            balance -= record.amount;
        }
    });

    document.getElementById('currentBalance').textContent = balance.toLocaleString();
}

//ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async function () {
    try {
        //データベースから記録を取得・表示
        await displayRecordsFromDatabase();

        //キーワードのみリアルタイム検索
        document.getElementById('keyword').addEventListener('input', function () {
            if (this.value === '') {
                searchRecords();
            }
        });

    } catch (error) {
        console.error('初期化エラー:', error);
        showErrorPopup('クリアにしっぱいしたよ');
    }
});

//データベースから取得した記録を表示
async function displayRecordsFromDatabase() {
    try {
        //ローディング表示
        showLoading();

        //データベースから記録を取得
        const records = await fetchRecordsFromDatabase();

        //テーブルに表示
        const tbody = document.getElementById('records-tbody');

        if (records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-records">きろくがないよ</td></tr>';
        } else {
            const recordsHtml = records.map(record => {
                console.log('記録データ:', record); // デバッグ用
                console.log('記録ID:', record.recordId); // デバッグ用

                return `
                <tr>
                    <td>${record.recordDate}</td>
                    <td><span class="type-badge ${record.recordType}">${record.recordType === 'received' ? 'もらった' : 'つかった'}</span></td>
                    <td>¥${record.amount.toLocaleString()}</td>
                    <td>${record.category}</td>
                    <td>${record.memo}</td>
                    <td>
                        <button class="edit-btn" onclick="editRecord('${record.recordId}')">なおす</button>
                        <button class="delete-btn" onclick="deleteRecord('${record.recordId}')">けす</button>
                    </td>
                </tr>
    `;
            }).join('');
            tbody.innerHTML = recordsHtml;
        }

        //残高を更新
        updateBalanceFromRecords(records);
    } catch (error) {
        //エラーメッセージを表示
        showErrorPopup(error.message);
    } finally {
        //ローディングを表示
        hideLoading();
    }
}

//ローディング表示
function showLoading() {
    const tbody = document.getElementById('records-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">よみこみ中．．．</td></tr>';
}

//ローディング非表示
function hideLoading() {
    //ローディング非表示はdisplayRecordsFromDatabaseで上書きされる
}

//エラーポップアップ表示
function showErrorPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    popupMessage.textContent = message;
    popupButtons.innerHTML = '<button onclick="hidePopup()">OK</button>';
    popup.style.display = 'flex';

}

//ポップアップ非表示
function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

//削除確認ポップアップを表示
function showDeleteConfirmPopup(recordId) {
    const popup = document.getElementById('deleteConfirmPopup');
    popup.style.display = 'flex';

    //削除ボタンのイベントリスナー
    document.getElementById('confirmDeleteBtn').onclick = async function () {
        try {
            //削除処理を実行
            await executeDelete(recordId);
            //ポップアップを閉じる
            hideDeleteConfirmPopup();

        } catch (error) {
            console.error('削除エラー:', error);
            alert(error.message);
        }
    };

    //キャンセルボタンのイベントリスナー
    document.getElementById('cancelDeleteBtn').onclick = hideDeleteConfirmPopup;
}


async function executeDelete(recordId) {
    try {
        //セッションからユーザーIDを取得
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.userId) {
            throw new Error('ユーザーじょうほうが見つからないよ。もう1回ログインしてね。');
        }

        //削除API呼び出し
        const response = await fetch(`http://localhost:8080/kids/records/${recordId}?userId=${user.userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('きろくがけせなかったよ');
        }

        showDeleteSuccessPopup();

    } catch (error) {
        console.error('削除エラー:', error);
        throw error;
    }
}

//削除成功ポップアップを表示
function showDeleteSuccessPopup() {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    //メッセージを設定
    popupMessage.innerHTML = `
        <p>きろくをけしました！</p>
    `;

    //ボタンを設定
    popupButtons.innerHTML = `<button onclick="hideDeleteSuccessPopup()" class="popup-button">OK</button>`;

    //ポップアップを非表示
    popup.style.display = 'flex';
}

//削除確認ポップアップを非表示
function hideDeleteConfirmPopup() {
    document.getElementById('deleteConfirmPopup').style.display = 'none';
}

//削除成功ポップアップを非表示
function hideDeleteSuccessPopup(){
    document.getElementById('popup').style.display = 'none';
    //履歴画面に戻る
    location.reload();
}
