//カレンダー管理クラス
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.records = []; // 初期化時は空配列
        this.init();
    }

    async init() {
        await this.updateBalance();
        this.renderCalendar();
        this.bindEvents();
    }

    //データベースから記録を取得
    async fetchRecordsFromDatabase() {
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

            const data = await response.json();

            if (data.success && Array.isArray(data.records)) {
                return data.records;
            } else {
                throw new Error('データの形式が正しくありません');
            }
        } catch (error) {
            console.error('記録取得エラー:', error);
            // エラー時はサンプルデータを返す
            return this.getSampleRecords();
        }
    }

    //サンプルデータ(APIが使えない場合のフォールバック)
    getSampleRecords() {
        return [
            { recordDate: '2025-07-01', recordType: 'received', amount: 1000, category: 'おこづかい', memo: '' },
            { recordDate: '2025-07-01', recordType: 'spent', amount: 500, category: 'おかし', memo: 'チョコ' },
            { recordDate: '2025-07-15', recordType: 'received', amount: 2000, category: 'おてつだい', memo: 'おじいちゃんから' },
            { recordDate: '2025-07-20', recordType: 'spent', amount: 800, category: 'おもちゃ', memo: 'がちゃがちゃ' }
        ];
    }

    //残高計算と表示
    updateBalanceFromRecords(records) {
        let balance = 0;

        records.forEach(record => {
            if (record.recordType === 'received') {
                balance += record.amount;
            } else if (record.recordType === 'spent') {
                balance -= record.amount;
            }
        });

        const balanceElement = document.getElementById('currentBalance');
        if (balanceElement) {
            balanceElement.textContent = balance.toLocaleString();
        }
    }

    //残高更新関数
    async updateBalance() {
        try {
            //記録データを取得
            this.records = await this.fetchRecordsFromDatabase();

            //残高を計算
            this.updateBalanceFromRecords(this.records);
        } catch (error) {
            console.error('残高更新エラー:', error);
        }
    }

    //カレンダーを描画
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        //月表示を更新
        const monthElement = document.getElementById('currentMonth');
        if (monthElement) {
            monthElement.textContent = `${year}年${month + 1}月`;
        }

        const calendarBody = document.getElementById('calendarBody');
        if (!calendarBody) {
            console.error('カレンダー本体の要素が見つかりません');
            return;
        }

        calendarBody.innerHTML = '';

        //月の最初の日を取得
        const firstDay = new Date(year, month, 1);

        //月の最初の日の曜日を取得(0=日曜日, 1=月曜日...)
        const firstDayOfWeek = firstDay.getDay();

        //月の最後の日を取得
        const lastDay = new Date(year, month + 1, 0);
        const lastDayOfMonth = lastDay.getDate();

        //前月の日数を取得
        const prevMonthLastDay = new Date(year, month, 0);
        const prevMonthDay = prevMonthLastDay.getDate();

        //カレンダーの開始日(前月の日付から)
        const startDate = new Date(year, month, 1);
        startDate.setDate(startDate.getDate() - firstDayOfWeek);

        //6週間分の日付を生成
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);

                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = currentDate.getDate();

                //前月・翌月の日付は薄く表示
                if (currentDate.getMonth() !== month) {
                    dayElement.classList.add('other-month');
                }

                //記録がある日付にマークをつける
                const dateString = this.formatDate(currentDate);
                if (this.hasRecords(dateString)) {
                    dayElement.classList.add('has-records');
                }

                //日付をクリックしたときの処理
                dayElement.addEventListener('click', () => {
                    this.selectDate(currentDate, dayElement);
                });

                calendarBody.appendChild(dayElement);
            }
        }
    }

    //日付を選択
    selectDate(date, clickedElement) {
        //前回選択した日付の選択状態を解除
        const prevSelected = document.querySelector('.calendar-day.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }

        //クリックされた要素を選択状態にする
        clickedElement.classList.add('selected');

        this.selectedDate = date;
        this.showDayDetails(date);
    }

    //日付の詳細を表示
    showDayDetails(date) {
        const dateString = this.formatDate(date);
        const dayRecords = this.records.filter(record => record.recordDate === dateString);

        const detailsContainer = document.getElementById('dayDetails');
        const titleElement = document.getElementById('selectedDateTitle');
        const recordsListElement = document.getElementById('recordsList');

        if (!detailsContainer || !titleElement || !recordsListElement) {
            console.error('日付詳細表示の要素が見つかりません');
            return;
        }

        titleElement.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の記録`;

        if (dayRecords.length === 0) {
            recordsListElement.innerHTML = '<p>この日のきろくはないよ</p>';
        } else {
            recordsListElement.innerHTML = '';
            dayRecords.forEach(record => {
                const recordElement = this.createRecordElement(record);
                recordsListElement.appendChild(recordElement);
            });
        }

        detailsContainer.style.display = 'block';
    }

    //記録要素を作成
    createRecordElement(record) {
        const recordElement = document.createElement('div');
        recordElement.className = `record-item ${record.recordType}`;

        const typeText = record.recordType === 'received' ? 'もらった' : 'つかった';

        recordElement.innerHTML = `
            <div class="record-info">
                <span class="record-type ${record.recordType}">${typeText}</span>
                <span class="record-amount">¥${record.amount.toLocaleString()}</span>
            </div>
            <div class="record-category">${record.category}</div>
            <div class="record-memo">${record.memo}</div>
        `;

        return recordElement;
    }

    //記録があるかチェック
    hasRecords(dateString) {
        return this.records.some(record => record.recordDate === dateString);
    }

    //日付をフォーマット
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //前月に移動
    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    //翌月に移動
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    //イベントをバインド
    bindEvents() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.prevMonth();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextMonth();
            });
        }
    }
}

//ページ読み込み時にカレンダーを初期化
document.addEventListener('DOMContentLoaded', function () {
    new Calendar();
});