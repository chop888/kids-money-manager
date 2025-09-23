document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const successPopup = document.getElementById('successPopup');
    const okBtn = document.getElementById('okBtn');
    const toggleBtn = document.getElementById('toggle-password');
    const toggleConfirmBtn = document.getElementById('toggle-confirm-password');
    //パスワード要素を取得
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    //フォーム全体のバリデーション
    function validateForm() {
        let isValid = true;
        clearErrors();

        //苗字のバリデーション
        const lastName = document.getElementById('lastName').value.trim();
        console.log('苗字:', lastName); // デバッグ用
        if (!lastName) {
            showError('lastNameError', 'みょうじを入力してね');
            isValid = false;
        }

        //名前のバリデーション
        const firstName = document.getElementById('firstName').value.trim();
        console.log('名前:', firstName); // デバッグ用
        if (!firstName) {
            showError('firstNameError', 'なまえを入力してね');
            isValid = false;
        }

        //ニックネームのバリデーション
        const nickname = document.getElementById('nickname').value.trim();
        console.log('ニックネーム:', nickname); // デバッグ用
        if (!nickname) {
            showError('nicknameError', 'ニックネームを入力してね');
            isValid = false;
        } else if (nickname.length < 6) {
            showError('nicknameError', 'ニックネームは6文字いじょうにしてね');
            isValid = false;
        } else if (!/[a-zA-Z]/.test(nickname) || !/[0-9]/.test(nickname) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(nickname)) {
            showError("nicknameError", "ニックネームはローマ字・数字・きごうをくみ合わせてね");
            isValid = false;
        }
        //パスワードのバリデーション
        const passwordValue = password.value;
        console.log('パスワード:', password); // デバッグ用
        if (!passwordValue) {
            showError('passwordError', 'パスワードを入力してね');
            isValid = false;
        } else if (passwordValue.length < 8) {
            showError('passwordError', 'パスワードは8文字いじょうにしてね');
            isValid = false;
        } else if (!/[a-zA-Z]/.test(passwordValue) || !/[0-9]/.test(passwordValue) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue)) {
            showError('passwordError', 'パスワードはローマ字・数字・きごうをくみ合わせてね');
            isValid = false;
        }

        //パスワード確認のバリデーション
        const confirmPasswordValue = confirmPassword.value;
        console.log('パスワード確認:', confirmPasswordValue); // デバッグ用
        if (!confirmPasswordValue) {
            showError('confirmPasswordError', 'パスワード(かくにん)を入力してね');
            isValid = false;
        } else if (passwordValue !== confirmPasswordValue) {
            showError('confirmPasswordError', 'パスワードがあわないよ');
            isValid = false;
        }

        console.log('バリデーション結果:', isValid); // デバッグ用

        return isValid;
    }

    //ユーザー登録API呼び出し
    async function registerUser() {
        try {
            //登録データの取得
            const registrationData = {
                lastName: document.getElementById('lastName').value.trim(),
                firstName: document.getElementById('firstName').value.trim(),
                nickname: document.getElementById('nickname').value.trim(),
                password: password.value
            };

            console.log('送信データ:', registrationData);//デバッグ用

            //ローディング表示
            showLoading();

            //バックエンドAPIにPOSTリクエスト送信
            const response = await fetch('http://localhost:8080/kids/register', { // /kids/registerというURLに対してJSON形式のデータを送信
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            //レスポンスをJSON形式で取得
            const result = await response.json();

            console.log('APIレスポンス:', result);//デバッグ用

            //レスポンスの処理
            if (result.success) {
                //登録成功
                showSuccessPopup();
                console.log('登録成功:', result.message);
            } else {
                //登録失敗(バックエンドからのエラー)
                showErrorMessage(result.message);
                console.log('登録失敗:', result.message);
            }
        } catch (error) {
            //ネットワークエラーなどの例外
            console.log('登録エラー:', error);
            showErrorMessage('ネットワークエラーがはっせいしたよ。もう1回ためしてね。');
        } finally {
            //ローディング非表示
            hideLoading();
        }

    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    function showSuccessPopup() {
        successPopup.style.display = 'flex';
    }


    //ローディング表示
    function showLoading() {
        const submitBtn = document.querySelector('.register-btn');
        if (submitBtn) {
            submitBtn.textContent = 'とうろく中...';
            submitBtn.disabled = true;
        }
    }

    //ローディング非表示
    function hideLoading() {
        const submitBtn = document.querySelector('.register-btn');
        if (submitBtn) {
            submitBtn.textContent = 'とうろく';
            submitBtn.disabled = false;
        }
    }

    //バックエンドからのエラーメッセージ表示
    function showErrorMessage(message) {
        //既存のエラーメッセージをクリア
        clearErrors();

        //エラーメッセージを表示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        //フォームの下に表示
        form.appendChild(errorDiv);
    }
    //イベントリスナーを設定
    toggleBtn.addEventListener('click', () => {
        if (password.type === 'password') {
            password.type = 'text';
            toggleBtn.textContent = "かくす";
        } else {
            password.type = "password";
            toggleBtn.textContent = "ひょうじ"
        }
    });

    toggleConfirmBtn.addEventListener('click', () => {
        if (confirmPassword.type === 'password') {
            confirmPassword.type = 'text';
            toggleConfirmBtn.textContent = "ひひょうじ";
        } else {
            confirmPassword.type = "password";
            toggleConfirmBtn.textContent = "ひょうじ"
        }
    });

    //フォーム送信
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        console.log('フォーム送信が実行されました'); // デバッグ用

        if (validateForm()) {
            //バックエンドAPIに送信
            registerUser();
        }
    });

    //OKボタンのイベント
    okBtn.addEventListener('click', function () {
        successPopup.style.display = 'none';
        window.location.href = 'login.html';
    });

});