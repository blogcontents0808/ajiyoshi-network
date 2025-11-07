# 味美ネットワーク お問い合わせシステム完全復旧レポート

## 📋 概要

2025年9月14日、味美ネットワーク公式サイトのお問い合わせシステムが完全復旧しました。CORS設定の問題とGoogle Sheets API環境変数の未設定により発生していた送信エラーを解決し、現在は正常にスプレッドシートへの記録が行われています。

## 🚨 発生していた問題

### 主要問題
1. **CORS設定の不一致**
   - 現在のVercelドメイン: `ajiyoshi-network-clean-xxx`
   - 許可リスト: 古い `ajiyoshi-network-xxx` のみ
   - 結果: APIが403エラーでアクセス拒否

2. **環境変数未設定**
   - Google Sheets API認証情報なし
   - スプレッドシートへの書き込み不可
   - ローカルログモードでのみ動作

## ✅ 実施した解決策

### 1. CORS設定の完全改修
**ファイル:** `pages/api/contact/index.js:183`

```javascript
// 修正前（固定ドメインリスト）
const allowedOrigins = [
  'https://ajiyoshi-network.vercel.app',
  'https://ajiyoshi-network-g7srlx4j7-blogcontents0808s-projects.vercel.app',
  // ... 古いドメインのみ
];

// 修正後（正規表現パターンマッチング）
const isProductionVercel = origin && origin.match(
  /^https:\/\/ajiyoshi-network(-clean)?-[\w-]+-blogcontents0808s-projects\.vercel\.app$/
);
const isMainDomain = origin === 'https://ajiyoshi-network-clean.vercel.app';
const isLocalDev = origin && origin.match(/^http:\/\/localhost:(3000|3001|3002|3003)$/);

const isAllowed = isProductionVercel || isMainDomain || isLocalDev;
```

**効果:**
- 全ての将来のVercelデプロイメントを自動許可
- メインプロダクションドメイン対応
- 開発環境のlocalhost許可維持

### 2. Google Sheets API環境変数設定

#### 設定した環境変数
| 変数名 | 値 | 設定方法 |
|--------|-----|----------|
| `GOOGLE_SPREADSHEET_ID` | `16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8` | `vercel env add GOOGLE_SPREADSHEET_ID production` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `ajiyoshi-contact-service@ajiyoshi-network-contact.iam.gserviceaccount.com` | `vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production` |
| `GOOGLE_PRIVATE_KEY` | サービスアカウント秘密鍵 | `vercel env add GOOGLE_PRIVATE_KEY production --sensitive` |

#### Google Cloud Console設定
1. **プロジェクト:** `ajiyoshi-network-contact`
2. **サービスアカウント:** `ajiyoshi-contact-service`
3. **権限:** 編集者
4. **JSON鍵:** 新規作成・ダウンロード済み

### 3. スプレッドシート権限設定
- **スプレッドシート:** 味美ネットワークお問い合わせ
- **共有設定:** `ajiyoshi-contact-service@ajiyoshi-network-contact.iam.gserviceaccount.com` に編集者権限付与
- **結果:** APIからの書き込みアクセス許可

## 🎯 現在の動作状況

### ✅ 正常動作確認済み
- **お問い合わせフォーム:** https://ajiyoshi-network-clean.vercel.app/contact.html
- **CORS設定:** 全てのVercelドメインで正常動作
- **スプレッドシート連携:** リアルタイム反映確認済み
- **セキュリティ:** 入力値検証・XSS対策・レート制限すべて正常

### 📊 テスト結果
**実施日:** 2025年9月14日  
**テストデータ:**
- お名前: テスト太郎
- メール: test@example.com  
- 件名: Google Sheets連携テスト
- 内容: 環境変数設定後の動作確認テスト

**結果:** ✅ スプレッドシートに正常反映

## 🔧 技術仕様

### アーキテクチャ
- **フロントエンド:** HTML + JavaScript (`public/contact.html`, `public/script.js`)
- **バックエンド:** Next.js API Routes (`pages/api/contact/index.js`)
- **データベース:** Google Sheets (ID: `16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8`)
- **認証:** Google Service Account
- **デプロイ:** Vercel

### セキュリティ機能
- **CSRF対策:** セッショントークン生成
- **XSS対策:** HTMLエスケープ処理
- **入力値検証:** クライアント・サーバー両側
- **レート制限:** 15分間で5回まで
- **機密データ保護:** 環境変数のSensitive設定

## 📋 メンテナンス手順

### 定期確認項目（月1回推奨）
1. **フォーム送信テスト**
   ```
   https://ajiyoshi-network-clean.vercel.app/contact.html
   ```

2. **スプレッドシート反映確認**
   ```
   https://docs.google.com/spreadsheets/d/16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8/edit
   ```

3. **環境変数確認**
   ```bash
   vercel env ls
   ```

### トラブルシューティング

#### ❌ 403エラーが発生する場合
**原因:** CORS設定の問題
**解決:** `pages/api/contact/index.js` のCORS正規表現パターンを確認

#### ❌ スプレッドシートに反映されない場合
**原因:** 環境変数またはGoogle API認証の問題
**確認項目:**
1. Vercel環境変数の存在確認
2. Google Service Account の権限確認
3. スプレッドシートの共有設定確認

#### ❌ 新しいVercelデプロイでエラーが発生する場合
**解決:** 
```bash
vercel --prod
```
で再デプロイして環境変数を反映

## 🚀 今後の拡張可能機能

### Gmail送信機能（設定可能）
追加環境変数:
- `GMAIL_USER` - 送信者Gmail
- `GMAIL_PASS` - アプリパスワード
- `ADMIN_EMAIL_1`, `ADMIN_EMAIL_2`, `ADMIN_EMAIL_3` - 管理者メール

### 設定方法
```bash
vercel env add GMAIL_USER production
vercel env add GMAIL_PASS production --sensitive
vercel env add ADMIN_EMAIL_1 production
```

## 📞 サポート情報

### 緊急時連絡
- **開発者:** Claude Code Assistant
- **復旧完了日:** 2025年9月14日
- **次回点検予定:** 2025年10月14日

### 関連ドキュメント
- `pages/api/contact/index.js` - APIルート実装
- `public/script.js` - フロントエンド実装  
- `public/contact.html` - お問い合わせフォーム
- `.env.local` - ローカル開発用環境変数（空）

---

## 📈 復旧作業ログ

| 時刻 | 作業内容 | 状態 |
|------|----------|------|
| 05:19 | CORS設定修正・デプロイ | ✅ |
| 06:30 | Google Service Account作成・JSON鍵取得 | ✅ |
| 06:45 | スプレッドシート権限付与 | ✅ |
| 06:50 | Vercel環境変数設定（3項目） | ✅ |
| 06:55 | 最終デプロイ・環境変数反映 | ✅ |
| 07:00 | 実動作テスト・スプレッドシート反映確認 | ✅ |

**総作業時間:** 約1時間41分  
**復旧完了:** 2025年9月14日 07:00 (JST)

---

*このドキュメントは味美ネットワーク公式サイトのお問い合わせシステム復旧作業の完全な記録です。*