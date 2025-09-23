//編集対象の記録IDを格納する変数
let editRecordId = null;

//カテゴリー設定
const receivedCategories = [
    { value: 'おこづかい', text: 'おこづかい' },
    { value: 'おてつだい', text: 'おてつだい' },
    { value: 'お年玉', text: 'お年玉' },
    { value: 'プレゼント', text: 'プレゼント' },
    { value: 'それいがい', text: 'それいがい' }
];

const spentCategories = [
    { value: 'おかし', text: 'おかし' },
    { value: 'ごはん', text: 'ごはん' },
    { value: 'おもちゃ', text: 'おもちゃ' },
    { value: 'ゲーム', text: 'ゲーム' },
    { value: '本', text: '本' },
    { value: 'それいがい', text: 'それいがい' }
];

//カテゴリーを更新する関数
function updateCategories(type) {
    const categorySelect = document.getElementById('editCategory');
    categorySelect.innerHTML = '';

    const categories = type === 'received' ? receivedCategories : spentCategories;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.text;
        categorySelect.appendChild(option);
    });
}

//記録データを読み込んで表示する関数
async function loadRecordData(recordId) {
    try {
        console.log("記録ID:", recordId);//デバッグ用

        //セッションからuserIdを取得
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log("ユーザー情報:", user);//デバッグ用

        if (!user || !user.userId) {
            throw new Error('ユーザーじょうほうが見つからないよ。もう1回ログインしてね。');
        }


        //記録データを取得
        const apiUrl = `http://localhost:8080/kids/records/${recordId}?userId=${user.userId}`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);
        console.log("レスポンス:", response);

        if (!response.ok) {
            throw new Error('きろくのよみこみができなかったよ (${response.status})');
        }

        const data = await response.json();
        console.log("記録データ:", data);

        //フォームにデータを設定
        setFormData(data.record);
    } catch (error) {
        console.error('記録読み込みエラー:', error);
        alert(error.message);
    }

}

//フォームに記録データを設定する関数
function setFormData(record) {
    //日付を設定
    document.getElementById('editDate').value = record.recordDate;
    //タイプを設定
    document.getElementById('editType').value = record.recordType;
    //金額を設定
    document.getElementById('editAmount').value = record.amount;
    //カテゴリーを設定(タイプに応じて更新)
    updateCategories(record.recordType);
    document.getElementById('editCategory').value = record.category;
    //メモを設定
    document.getElementById('editMemo').value = record.memo || '';
}


//保存処理
async function saveRecord() {
    try {
        //フォームデータを取得
        const formData = {
            recordDate: document.getElementById('editDate').value,
            recordType: document.getElementById('editType').value,
            amount: parseInt(document.getElementById('editAmount').value),
            category: document.getElementById('editCategory').value,
            memo: document.getElementById('editMemo').value
        };

        //バリデーション
        if (!validateFormData(formData)) {
            return;
        }

        //データベースを更新
        await updateRecord(editRecordId, formData);

        //保存成功ポップアップを表示
        const popup = document.getElementById('savePopup');
        popup.style.display = 'flex';
    } catch (error) {
        console.error('保存エラー:', error);
        alert(error.message);
    }


}

//フォームデータのバリデーション
function validateFormData(data) {
    //エラーメッセージをクリア
    clearAllErrors();

    let hasError = false;

    if (!data.recordDate) {
        showFieldError('dateError', 'ひづけをえらんでね');
        hasError = true;
    }

    if (!data.recordType) {
        showFieldError('typeError', 'タイプをえらんでね');
        hasError = true;
    }

    if (!data.amount || data.amount <= 0) {
        showFieldError('amountError', 'お金を入力してね');
        hasError = true;
    }

    if (!data.category) {
        showFieldError('categoryError', 'カテゴリーをえらんでね');
        hasError = true;
    }

    return !hasError;
}

//データベースの記録を更新
async function updateRecord(recordId, recordData) {
    try {
        //セッションからuserIdを取得
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.userId) {
            throw new Error('ユーザーじょうほうが見つからないよ。');
        }

        //PUT APIを呼び出し
        const response = await fetch(`http://localhost:8080/kids/records/${recordId}?userId=${user.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });

        if (!response.ok) {
            throw new Error('きろくのこうしんにしっぱいしたよ');
        }

        return await response.json();
    } catch (error) {
        console.error('更新エラー:', error);
        throw error;
    }

}

//エラーメッセージ表示・非表示
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#FF6928'
        errorElement.style.display = 'block';
    }
}
function hideFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
        errorElement.style.display = '';
    }
}

function clearAllErrors() {
    const errorIds = ['dateError', 'typeError', 'amountError', 'categoryError'];
    errorIds.forEach(id => hideFieldError(id));
}

//キャンセル処理
function cancelEdit() {
    location.href = 'history.html';
}

//ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', async function () {
    try {
        //URLパラメータから記録IDを取得
        const urlParams = new URLSearchParams(window.location.search);
        editRecordId = urlParams.get('id');

        if (!editRecordId) {
            throw new Error('なおすきろくがえらばれていないよ');
        }

        //記録データを読み込んで表示
        await loadRecordData(editRecordId);

    } catch (error) {
        console.error('初期化エラー:', error);
        alert(error.message);
        //エラーの場合は履歴画面に戻る
        location.href = 'history.html';
    }


    //タイプ変更時のカテゴリー更新
    document.getElementById('editType').addEventListener('change', function () {
        updateCategories(this.value);
    });

    //保存ボタンのイベントリスナー
    document.getElementById('saveBtn').addEventListener('click', saveRecord);

    //キャンセルボタンのイベントリスナー
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);

    //OKボタンのイベントリスナー
    document.getElementById('okBtn').addEventListener('click', function () {
        document.getElementById('savePopup').style.display = 'none';
        location.href = 'history.html';
    });
});
