
document.addEventListener("DOMContentLoaded", () => {
    //要素の取得
    const receivedTab = document.getElementById("received-tab");
    const spentTab = document.getElementById("spent-tab");
    const dateInput = document.getElementById("date");
    const categorySelect = document.getElementById("category");
    const form = document.getElementById("transaction-form");
    const amountError = document.getElementById("amount-error");
    const categoryError = document.getElementById("category-error");

    //今日の日付をデフォルトに設定
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    //タブ切り替え機能
    function switchTab(tabType) {
        const receivedCategories = categorySelect.querySelectorAll('.received-category');
        const spentCategories = categorySelect.querySelectorAll('.spent-category');

        if (tabType === 'received') {
            //もらったタブをactiveに
            receivedTab.classList.add('active');
            spentTab.classList.remove('active');

            //カテゴリーを動的に取得・表示
            loadCategories('received');

        } else if (tabType === 'spent') {
            //つかったタブをactiveに
            spentTab.classList.add('active');
            receivedTab.classList.remove('active');

            //カテゴリーを動的に取得・表示
            loadCategories('spent');
        }
        //カテゴリーをリセット
        categorySelect.value = '';

    }

    //htmlの"switchTab('received')"を使えるようにする
    window.switchTab = switchTab;

    //カテゴリーの動的取得 API
    async function loadCategories(recordType) {
        try {
            const response = await fetch(`http://localhost:8080/kids/categories/${recordType}`);
            const result = await response.json();

            if (result.success) {
                updateCategoryOptions(result.categories, recordType);
            } else {
                console.error('カテゴリー取得エラー:', result.message);
            }
        } catch (error) {
            console.error('カテゴリー取得エラー:', error);
        }
    }

    //カテゴリーオプションの更新
    function updateCategoryOptions(categories, recordType) {
        const categorySelect = document.getElementById('category');

        //既存のオプションをクリア(「カテゴリーを選ぶ」以外)
        const defaultOption = categorySelect.querySelector('option[value=""]');
        categorySelect.innerHTML = '';
        if (defaultOption) {
            categorySelect.appendChild(defaultOption);
        }

        //新しいカテゴリオプションを追加
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryName;
            option.textContent = category.categoryName;
            option.className = `${recordType}-category`;
            categorySelect.appendChild(option);
        });
    }

    //フォーム送信処理
    form.addEventListener("submit", async (e) => { //HTML:<form id="transaction-form"の送信イベントをキャッチ
        e.preventDefault();

        let valid = true;

        //金額のバリデーション
        const amount = document.getElementById("amount");
        if (amount.value.trim() === "") {
            amountError.textContent = "※お金を入力してね";
            valid = false;
        } else {
            amountError.textContent = "";
        }

        //カテゴリーのバリデーション
        if (categorySelect.value === "") {
            categoryError.textContent = "※カテゴリーを選んでね";
            valid = false;
        } else {
            categoryError.textContent = "";
        }

        if (!valid) {
            return;
        }

        //セッションからユーザー情報を取得
        const user = JSON.parse(sessionStorage.getItem('user'));
        console.log('セッションから取得したユーザー情報:', user); // デバッグ用
        if (!user || !user.userId) {
            console.log('ユーザー情報が不足:', user); // デバッグ用
            showErrorPopup('ユーザーのじょうほうが見つからないよ。もう1回ログインしてね。');
            return;
        }

        //フォームデータの取得
        const formData = new FormData(form);
        const transactionData = {
            recordType: receivedTab.classList.contains('active') ? 'received' : 'spent',
            recordDate: formData.get('date'),
            amount: parseInt(formData.get('amount')),
            category: formData.get('category'),
            memo: formData.get('memo')
        };

        //バックエンドAPIに送信
        await submitRecord(transactionData, user.userId);


    });

    //収支記録登録API呼び出し
    async function submitRecord(recordData, userId) {
        try {
            //ローディング表示
            showLoading();

            const response = await fetch(`http://localhost:8080/kids/records?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recordData)
            });

            const result = await response.json();

            if (result.success) {
                //成功時の処理
                showSuccessPopup();
                updateBalance();
                resetForm();
            } else {
                //エラー時の処理
                showErrorPopup(result.message || 'きろくのとうろくにしっぱいしたよ');
            }
        } catch (error) {
            console.error('記録登録エラー:', error);
            showErrorPopup('ネットワークエラーがはっせいしたよ');
        } finally {
            hideLoading();
        }
    }


    //成功ポップアップ表示関数
    function showSuccessPopup() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'flex';
    }

    //OKボタンで閉じる処理
    const modalOkBtn = document.getElementById('modal-ok-btn');
    modalOkBtn.addEventListener('click', function () {
        document.getElementById('success-modal').style.display = 'none';
    });

    //ローディング表示
    function showLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'とうろく中．．．';
        submitBtn.disabled = true;
    }

    //ローディング非表示
    function hideLoading() {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = '📒きろくする';
        submitBtn.disabled = false;
    }

    //エラーポップアップ表示
    function showErrorPopup(message) {
        const popup = document.getElementById('popup');
        const popupMessage = document.getElementById('popupMessage');
        const popupButtons = document.getElementById('popupButtons');

        popupMessage.textContent = message;
        popupMessage.className = 'popup-message error';
        popupButtons.innerHTML = '<button class="popup-button">OK</button>';

        popup.style.display = 'flex';

        //OKボタンのイベントリスナー
        const okBtn = popupButtons.querySelector('.popup-button');
        okBtn.addEventListener("click", () => {
            popup.style.display = 'none';
        });
    }

    //フォームリセット
    function resetForm() {
        form.reset();
        dateInput.value = today;
        amountError.textContent = '';
        categoryError.textContent = '';
    }

    //金額入力のフォーマット
    const amountInput = document.getElementById('amount');
    amountInput.addEventListener("input", (e) => {
        //数字以外の文字を除去
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    //サンプルデータを追加
    // function getSampleRecords() {
    //     return [
    //         { date: '2025-07-01', type: 'received', amount: 1000, category: 'おこづかい', memo: '' },
    //         { date: '2025-07-01', type: 'spent', amount: 500, category: 'おかし', memo: 'チョコ' },
    //         { date: '2025-07-15', type: 'received', amount: 2000, category: 'おてつだい', memo: 'おじいちゃんから' },
    //         { date: '2025-07-20', type: 'spent', amount: 800, category: 'おもちゃ', memo: 'がちゃがちゃ' }
    //     ];
    // }

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
                return data.records;//配列を返す
            } else {
                throw new Error('データの形式が正しくありません。')
            }
        } catch (error) {
            console.error('記録取得エラー:', error);
            return[];
        }
    }

    //残高を計算
    function updateBalanceFromRecords(records) {
        let balance = 0;

        records.forEach(record => {
            if (record.recordType === 'received') {
                balance += record.amount;
            } else {
                balance -= record.amount;
            }
        });

        //画面に表示
        document.getElementById('currentBalance').textContent = balance.toLocaleString();
    }

    //収支登録画面用の残高更新関数
    async function updateBalance() {
        try {
            //記録データを取得
            const records = await fetchRecordsFromDatabase();

            //残高を計算
            updateBalanceFromRecords(records);
        } catch(error){
            console.error('残高更新エラー', error);
        }

    }


    //初期化:使ったタブをデフォルトに
    switchTab('received');

    //残高更新を追加
    updateBalance();

});