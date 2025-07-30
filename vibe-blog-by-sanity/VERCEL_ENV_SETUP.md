# Vercel 環境変数設定ガイド

## 🔧 必要な環境変数

コンタクトフォームを正常に動作させるには、以下の環境変数をVercelで設定する必要があります：

### Google Sheets API設定

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Google Cloud Platformでサービスアカウントを作成
   - サービスアカウントのメールアドレス
   - 例: `your-service-account@your-project.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - サービスアカウントの秘密鍵（JSON形式）
   - 改行文字(`\n`)を含む完全な秘密鍵
   - 例: `"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`

### Gmail SMTP設定

3. **GMAIL_USER**
   - 送信に使用するGmailアドレス
   - 例: `your-email@gmail.com`

4. **GMAIL_PASS**
   - Googleアプリパスワード（2段階認証要）
   - 例: `abcd efgh ijkl mnop`

### 管理者メール設定

5. **ADMIN_EMAIL_1** (必須)
   - 主要管理者のメールアドレス
   - 例: `admin@example.com`

6. **ADMIN_EMAIL_2** (オプション)
   - 副管理者のメールアドレス

7. **ADMIN_EMAIL_3** (オプション)
   - 追加管理者のメールアドレス

## 🚀 Vercelでの環境変数設定手順

### 1. Vercelダッシュボードにアクセス
```
https://vercel.com/dashboard
```

### 2. プロジェクト選択
- **ajiyoshi-network** プロジェクトを選択

### 3. Settings → Environment Variables
1. プロジェクトの **Settings** タブをクリック
2. 左メニューから **Environment Variables** を選択
3. **Add New** ボタンをクリック

### 4. 各環境変数を追加
- **Name**: 環境変数名（上記リスト参照）
- **Value**: 対応する値
- **Environments**: `Production`, `Preview`, `Development` すべてにチェック

### 5. 設定完了後の確認
- **Deployments** タブで最新デプロイが正常完了を確認
- コンタクトフォームのテスト送信

## 🔐 Google Cloud Platform設定

### サービスアカウント作成手順

1. **Google Cloud Console**にアクセス
   ```
   https://console.cloud.google.com/
   ```

2. **プロジェクト選択または作成**

3. **APIとサービス** → **認証情報**

4. **認証情報を作成** → **サービスアカウント**

5. サービスアカウント詳細入力：
   - **名前**: `ajiyoshi-contact-form`
   - **説明**: `味美ネットワーク コンタクトフォーム用`

6. **役割の付与**:
   - `Editor` または `Google Sheets API` の適切な権限

7. **完了**後、作成されたサービスアカウントをクリック

8. **キー** タブ → **鍵を追加** → **新しい鍵を作成**

9. **JSON** 形式で鍵をダウンロード

10. JSONファイルから以下を取得：
    - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
    - `private_key` → `GOOGLE_PRIVATE_KEY`

### Google Sheets権限設定

1. **Google Sheets**で対象スプレッドシートを開く
   ```
   https://docs.google.com/spreadsheets/d/16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8
   ```

2. **共有** ボタンをクリック

3. サービスアカウントのメールアドレスを追加

4. **権限**: `編集者` に設定

5. **完了**

## 📧 Gmail設定

### アプリパスワード作成手順

1. **Googleアカウント管理**にアクセス
   ```
   https://myaccount.google.com/
   ```

2. **セキュリティ** → **2段階認証プロセス**
   - 2段階認証が無効の場合は有効化

3. **アプリパスワード**をクリック

4. **アプリを選択** → **その他（カスタム名）**

5. 名前入力: `味美ネットワーク コンタクトフォーム`

6. **生成** → 16桁のパスワードをコピー

7. このパスワードを `GMAIL_PASS` に設定

## 🧪 テスト方法

### 1. 開発環境テスト
```bash
# ローカルで環境変数設定後
npm run dev
# http://localhost:3000/contact でテスト
```

### 2. 本番環境テスト
```
https://ajiyoshi-network.vercel.app/contact
```

### 3. 確認項目
- [ ] フォーム送信成功
- [ ] Google Sheetsに記録追加
- [ ] 管理者通知メール受信
- [ ] ユーザー確認メール受信
- [ ] エラーメッセージが適切に表示

## ❗ 注意事項

1. **秘密鍵の管理**
   - 秘密鍵をGitにコミットしない
   - `.env.local` ファイルは `.gitignore` に追加済み

2. **権限の最小化**
   - サービスアカウントには必要最小限の権限のみ付与

3. **定期的な鍵の更新**
   - セキュリティのため定期的にアプリパスワードとサービスアカウント鍵を更新

4. **監視**
   - Vercelログで API エラーを定期監視
   - 不正なアクセスがないか確認

---

**作成日**: 2024年7月29日  
**更新日**: 2024年7月29日  
**バージョン**: 1.0.0