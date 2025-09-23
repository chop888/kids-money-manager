
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const nickname = document.getElementById("nickname");
    const password = document.getElementById("password");
    const nicknameError = document.getElementById("nickname-error");
    const passwordError = document.getElementById("password-error");
    const toggleBtn = document.getElementById("toggle-password");

    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");
    const popupButton = document.getElementById("popupButton");


    toggleBtn.addEventListener("click", () => {

        if (password.type === "password") {
            password.type = "text";
            toggleBtn.textContent = "かくす";
        } else {
            password.type = "password";
            toggleBtn.textContent = "ひょうじ";
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();//デフォルトの送信を防ぐ

        //バリデーション
        if (!validateForm()) {
            return;//バリデーション失敗時は処理を中断
        }

        //ログイン処理
        await loginUser();
    });

    //フォームバリデーション
    function validateForm() {

        let valid = true;

        if (nickname.value.trim() === "") {
            nicknameError.textContent = "※ニックネームを入力してね"
            valid = false;
        } else {
            nicknameError.textContent = "";
        }

        if (password.value.trim() === "") {
            passwordError.textContent = "※パスワードを入力してね";
            valid = false;
        } else {
            passwordError.textContent = "";
        }

        return valid;

    }

    //ログイン処理
    async function loginUser() {
        try {
            //ローディング表示
            showLoading();

            //ローディングデータの準備
            const loginData = {
                nickname: nickname.value.trim(),
                password: password.value
            };

            //バックエンドAPIに送信
            const response = await fetch('http://localhost:8080/kids/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.success) {

                console.log('ログイン成功:', result); // デバッグ用
                //ログイン成功
                showPopup('ログインしました！', 'success');

                const loginTime = new Date().getTime();
                const sessionTimeout = 30 * 60 * 1000; //30分

                const userData = {
                    userId: result.userId,
                    nickname: result.nickname,
                    loginTime: loginTime,
                    sessionTimeout: sessionTimeout
                };

                sessionStorage.setItem('user', JSON.stringify(userData));

                //収支登録画面に遷移
                popupButton.textContent = 'もらった・つかったのきろく画面へ';

            } else {
                //ログイン失敗
                showPopup(result.message || 'ログインできませんでした', 'error');
                popupButton.textContent = 'OK';
            }
        } catch (error) {
            console.error('ログインエラー:', error);
            showPopup('ネットワークエラーがはっせいしたよ。もう1回ためしてね。', 'error');
            popupButton.textContent = 'OK';

        } finally {
            hideLoading();
        }
    }

    //ローディング表示
    function showLoading() {
        const loginButton = document.querySelector('.login-button');
        loginButton.textContent = 'ログイン中．．．';
        loginButton.disabled = true;
    }

    //ローディング非表示
    function hideLoading() {
        const loginButton = document.querySelector('.login-button');
        loginButton.textContent = 'ログイン';
        loginButton.disabled = false;
    }

    //ポップアップ表示
    function showPopup(message, type = 'info') {
        popupMessage.textContent = message;
        popupMessage.className = `popup-message ${type}`;
        popup.style.display = 'flex';
    }

    //ポップアップ非表示
    function hidePopup() {
        popup.style.display = 'none';
    }

    //ポップアップのボタンクリックイベント
    popupButton.addEventListener("click", () => {
        hidePopup();

        //成功時は収支登録画面に遷移
        if (popupMessage.classList.contains('success')) {
            setTimeout(() => {
                window.location.href = 'income.html';
            }, 500);
        }
    });


});