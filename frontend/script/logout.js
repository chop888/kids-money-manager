/**
 * ログアウト処理
 * すべての画面で共通使用
 */
function logout() {
    //ポップアップで確認
    showConfirmPopup('ログアウトする？', () => {
        //確認OKの場合の処理
        executeLogout();
    });
}

/**
 * ログアウト処理の実行
 */
function executeLogout() {
    //セッションストレージからユーザー情報を取得

    const user = sessionStorage.getItem('user');

    if (!user) {
        //ユーザー情報がない場合は直接ログイン画面へ
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(user);
    const nickname = userData.nickname;

    //ログアウトAPIを呼び出し
    fetch('http://localhost:8080/kids/${nickname}/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                //ログアウト成功
                showMessagePopup('ログアウトしたよ！', 'success');

                //セッションストレージをクリア
                sessionStorage.removeItem('user');

                //2秒後にログイン画面に遷移
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                //ログアウト失敗
                showMessagePopup('ログアウトにしっぱいしたよ:' + result.message, 'error');
            }
        })
        .catch(error => {
            //エラーが発生した場合
            console.error('ログアウトエラー:', error);
            showMessagePopup('ログアウトでエラーがおきたよ。ログインがめんにもどるね！');

            //セッションストレージをクリアしてログイン画面へ
            sessionStorage.clear();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
}

/**
 * 確認ポップアップ表示
 */
function showConfirmPopup(message, onConfirm) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    //メッセージを設定
    popupMessage.textContent = message;
    popupMessage.className = 'popup-message';

    //ボタンを生成
    popupButtons.innerHTML = `
        <button id="confirmOk" class="popup-button">OK</button>
        <button id="confirmCancel" class="popup-button cancel-btn">キャンセル</button>
        `;

    //ポップアップを表示
    popup.style.display = 'flex';

    //イベントリスナーを設定
    document.getElementById('confirmOk').addEventListener('click', () => {
        popup.style.display = 'none';
        onConfirm();
    });

    document.getElementById('confirmCancel').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

/**
* メッセージポップアップ表示
*/
function showMessagePopup(message, type = 'info') {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    const popupButtons = document.getElementById('popupButtons');

    // メッセージを設定
    popupMessage.textContent = message;
    popupMessage.className = `popup-message ${type}`;

    // ボタンを生成
    popupButtons.innerHTML = `
        <button id="messageOk" class="popup-button">OK</button>
    `;

    // ポップアップを表示
    popup.style.display = 'flex';

    // イベントリスナーを設定
    document.getElementById('messageOk').addEventListener('click', () => {
        popup.style.display = 'none';
    });
}

/*セッション有効性チェック */
function isSessionValid() {
    const user = sessionStorage.getItem('user');

    if (!user) {
        return false;
    }

    try {
        const userData = JSON.parse(user);
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - userData.loginTime;

        // セッションタイムアウトチェック
        if (elapsedTime > userData.sessionTimeout) {
            // セッション期限切れ
            sessionStorage.removeItem('user');
            return false;
        }

        return true;
    } catch (error) {
        console.error('セッション情報の解析エラー:', error);
        return false;
    }
}

/**
* セッション監視開始
*/
function startSessionMonitor() {
    // 1分ごとにセッション有効性をチェック
    setInterval(() => {
        if (!isSessionValid()) {
            showMessagePopup('セッションがきれちゃったよ。もう1回ログインしてね！', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }, 60000); // 60秒 = 1分
}

/**
 * セッションタイマーリセット
 */
function resetSessionTimer() {
    const user = sessionStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            userData.loginTime = new Date().getTime(); // タイマーリセット
            sessionStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('セッションタイマーリセットエラー:', error);
        }
    }
}

/**
 * ログイン状態チェック
 * 各画面で共通使用
 */
function checkLoginStatus() {
    if (!isSessionValid()) {
        // セッションが無効な場合はログイン画面へ
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

/**
 * ページ読み込み時の初期化（更新版）
 */
document.addEventListener('DOMContentLoaded', function () {
    // ログイン画面以外ではログイン状態をチェック
    if (!window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('register.html')) {

        if (checkLoginStatus()) {
            // セッションが有効な場合、セッション監視を開始
            startSessionMonitor();
        }
    }
});

/**
 * ログアウトボタンのイベントリスナーを設定
 * 各画面のログアウトボタンに適用
 */
function setupLogoutButton() {
    const logoutButtons = document.querySelectorAll('.nav-btn');

    logoutButtons.forEach(button => {
        if (button.textContent.includes('ログアウト')) {
            console.log('ログアウトボタンを設定:', button.textContent);

            button.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        }
    });
}

//ページ読み込み時にログアウトボタンを設定
document.addEventListener('DOMContentLoaded', setupLogoutButton);

document.addEventListener('click', resetSessionTimer);
document.addEventListener('keypress', resetSessionTimer);
document.addEventListener('scroll', resetSessionTimer);
document.addEventListener('mousemove', resetSessionTimer);

