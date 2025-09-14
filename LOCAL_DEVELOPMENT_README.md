# ローカル開発環境 README

## 🚀 クイックスタート

### サーバー起動
```bash
# ルートディレクトリで
npm run build
PORT=3003 npm run start
```

**アクセス URL**: http://localhost:3003

## 📁 プロジェクト構成

```
ajiyoshi-network-clean/          # ルートNext.js
├── public/                      # 静的HTMLサイト配信
│   ├── index.html, blog.html等  # メインコンテンツ
│   ├── style.css, script.js     # スタイル・JS
│   └── images/                  # 画像アセット
├── pages/
│   ├── index.jsx               # ルートリダイレクト処理
│   └── api/contact/            # お問い合わせAPI
├── vibe-blog-by-sanity/        # 安全化済み（未使用）
└── next.config.js              # Next.js設定
```

## 🔧 主要URL

- **メインサイト**: http://localhost:3003/
- **ブログ**: http://localhost:3003/blog.html  
- **活動内容**: http://localhost:3003/activities.html
- **メンバー**: http://localhost:3003/members.html
- **沿革**: http://localhost:3003/history.html
- **お問い合わせ**: http://localhost:3003/contact.html
- **API**: http://localhost:3003/api/contact

## 💡 ローカル環境の特徴

### お問い合わせフォーム
- **本番**: Gmail + Google Sheets で実際送信
- **ローカル**: ログ記録のみ（環境変数未設定のため）
- **動作**: 両方とも成功レスポンス返却

### 画像処理
- `vibe-blog-by-sanity/app/lib/urlForImage.ts`: 安全化済み
- プレースホルダー画像: `/images/placeholder.jpg`
- Sanity未設定時の自動フォールバック

## 🔒 セキュリティ設定

- git push: `DISABLED` 設定済み
- CORS: localhost:3003 許可済み
- 入力値バリデーション: 全項目対応
- XSS対策: HTMLエスケープ実装

## 🛠️ 開発時の注意点

1. **環境変数**: ローカルでは未設定（意図的）
2. **ポート**: 3003番ポート使用（他ポートと重複回避）
3. **ビルド**: `npm run build` 後に `npm run start`
4. **警告**: "output: standalone" 警告は正常（設定通り）

## 📋 ロールバック手順

```bash
# 全変更を元に戻す場合
git restore -SW -- .

# 新規ファイルを削除
rm pages/index.jsx
rm vibe-blog-by-sanity/app/lib/urlForImage.ts
```

---
**最終更新**: 2025年9月12日  
**状態**: 完全動作・Vercel同期済み