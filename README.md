# kids Money Manager

## 概要
子供がお小遣いの収支を管理できるWebアプリケーション

## 開発期間
2025年7月～2025年8月(約1か月)

## 開発の目的
身近な課題を技術で解決する経験を積むため、実用的なWebアプリケーションの開発に取り組みました。
子供達が紙媒体でのお小遣いの管理が続きにくいという課題を、デジタル化することで解決するアプリケーションを設計・開発しました。

## ターゲット
小学生の子供
デジタルネイティブな子供世代

## 機能
- ユーザー登録・ログイン
- 収支の登録・編集・削除
- 収支記録の確認
- 残高表示
- カレンダー表示

## 技術スタック
### フロントエンド
- HTML5
- CSS3
- JavaScript

### バックエンド
- Java 21
- Spring Boot
- MyBatis

### データベース
- MySQL

### 開発環境
- Visual Studio Code
- Eclips
- MySQL Workbench

## 技術的な工夫点
- **セキュリティ対策**: パスワードをjBCryptで暗号化、MyBatisのPreparedStatementでSQLインジェクション対策
- **API設計**: RESTful APIで設計(HTTPメソッドとURLで操作を表現)
- **データベース設計**: テーブルを正規化し、カテゴリーと記録を分離してデータの整合性を確保
- **ユーザビリティ**: 子供でも使いやすいUI、色弱の子供にもわかりやすく明暗やアイコンを追加
- **開発効率**: Mavenで依存関係管理、フロントエンドとバックエンドを分離して並行開発

## 起動手順

### 必要な環境
- Java 21以上
- Maven 3.9以上
- MySQL 8.0以上
- Visual Studio Code

### データベース設定
1. MySQL Workbenchで `Kids_okodukai_db` データベースを作成
2. `kids_okodukai_db` を実行してテーブルを作成

### アプリケーション起動
1. **バックエンド起動**
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    - APIサーバーが `http://localhost:8080` で起動

2. **フロントエンド起動**
    - VSCodeで `frontend/login.html` を開く
    - Live Serverで `htttp://localhost:5500` でフロントエンドを表示

## APIエンドポイント

### ユーザー管理
- `POST /kids/register` - ユーザー登録
- `POST /kids/login` - ログイン
- `GET /kids/{nickname}` - ユーザー情報取得
- `POST /kids/{nickname}/logout` - ログアウト

### カテゴリー管理
- `GET /kids/categories` - 全カテゴリー取得
- `GET /kids/categories/{recordType}` - タイプ別カテゴリー取得

### 収支記録
- `POST /kids/records` - 収支記録登録
- `GET /kids/user/{userId}/records` - ユーザーの収支記録一覧
- `PUT /kids/records/{recordId}` - 収支記録更新
- `DELETE /kids/records/{recordId}` - 収支記録削除
- `POST /kids/records/search` - 収支記録検索

### 残高管理
- `GET /kids/users/{userId}/balance` - 現在の残高取得
- `GET /kids/users/{userId}/balance/summary` - 収支サマリー取得

## プロジェクト構造
|-- backend/ # バックエンド(Spring Boot)
| |-- src/
| | |-- main/
| | | |-- java/
| | | | |--com/example/app
| | | | | |-- controller/ # コントローラー
| | | | | | |-- BalanceController.java
| | | | | | |-- CategoryController.java
| | | | | | |-- RecordController.java
| | | | | | └── UserController.java
| | | | | |-- dto/ # データ転送オブジェクト
| | | | | |-- entity/ # エンティティ
| | | | | |-- mapper/ # MyBatisマッパー
| | | | | |-- service/ # サービス層
| | | | └─--- util/ # ユーティリティ
| | | └── resources/
| | | | |-- mybatis/
| | | | | |-- categoryMapper.xml
| | | | | |-- RecordMapper.xml
| | | | | └── UserMapper.xml
| | | └── - apllocation.properties
| | └── test/ #テストコード
| └── target/ # ビルド成果物
| └── pom.xml # Maven設定
|-- frontend/ # フロントエンド
| |-- html/ # HTMLファイル
| | |-- login.html
| | |-- register.html
| | |-- calendar.html
| | |-- edit.html
| | |-- history.html
| | └── income.html
| |-- script/ # JavaScriptファイル
| | |--calendar.js
| | |-- edit.js
| | |-- history.js
| | |-- income.js
| | |-- login.js
| | |-- logout.js
| | └── register.js
| |-- style/ # CSSファイル
| | |--calendar.css
| | |-- edit.css
| | |-- history.css
| | |-- income.css
| | |-- login.css
| | └── register.css
|-- .gitignore
└── REDME.md

## 開発の流れ

### 1.要件定義
- 子供がお小遣いを管理できるアプリの要件を整理
- 昨日一覧の決定(登録・記録・確認・カレンダー表示)

### 2.技能選定
- **フロントエンド**: HTML/CSS/JavaScript
- **バックエンド**: Java/Spring Boot
- **データベース**: MySQL

### 3.データベース設計
- ユーザー、カテゴリー、収支記録のテーブル設計
- 正規化によるデータの整合性確保
- カテゴリーと記録の分離設計

### 4.API設計
- RESTful APIで設計
- フロントエンドとバックエンドの分離
- 各機能に対応するエンドポイントの定義

### 5.バックエンド開発
- Spring BootでAPIサーバー構築
- MyBatisでデータベースアクセス
- セキュリティ対策(パスワード暗号化)

### 6.フロントエンド開発
- HTML/CSS/JavaScriptでUI構築
- 子供でも使いやすいデザイン、色弱にもわかりやすいUI
- APIとの連携処理

### 7.テスト・デバッグ
- フロントエンドとバックエンドの連携確認
- 全体の動作テスト
- ドキュメント整備

## デモ・スクリーンショット

### ログイン画面
![ログイン画面](frontend/assets/screenshot/login.png)
- ユーザー名(ニックネーム)とパスワードでログイン
- しんっぷるで使いやすいデザイン

### 会員登録画面
![会員登録画面](frontend/assets/screenshot/register.png)
- 新規ユーザーの登録
- バリデーション機能付き

### 収支登録画面
![収支登録画面](frontend/assets/screenshot/income.png)
- 収入・支出の記録
- カテゴリー選択機能

### 収支履歴画面
![収支履歴画面](frontend/assets/screenshot/history.png)
- 過去の収支記録一覧
- 検索・フィルター機能

### カレンダー画面
![カレンダー画面](frontend/assets/screenshot/calendar.png)
- 月別カレンダー表示
- 収支の可視化

### 編集画面
![編集画面](frontend/assets/screenshot/edit.png)
- 収支記録の編集・削除
- 直感的な操作
