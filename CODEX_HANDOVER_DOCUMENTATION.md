# 🤖 CODEX運用引継ぎドキュメント

**味美ネットワーク ウェブサイト - CODEX移行専用**

---

## 🎯 プロジェクト概要

### 📋 基本情報
- **プロジェクト名**: 味美ネットワーク公式サイト
- **技術スタック**: Next.js + Sanity CMS
- **ワークスペース**: `D:\AI-SANDBOX\ajiyoshi-network-clean`
- **運用開始**: 2025年11月
- **前任者**: Claude Code

### 🏗️ システム構成
```
ajiyoshi-network-clean/
├── app/              # Next.js App Router
├── vibe-blog-by-sanity/  # Sanity Studio
├── public/           # 静的ファイル
├── styles/           # スタイルシート
├── components/       # React コンポーネント
├── lib/              # ユーティリティ
└── api/              # API エンドポイント
```

---

## 🚀 起動・運用手順

### 1. 開発環境起動
```bash
# メインサイト起動
cd "D:\AI-SANDBOX\ajiyoshi-network-clean"
npm run dev          # http://localhost:3000

# Sanity Studio起動
cd vibe-blog-by-sanity
npm run studio       # http://localhost:3333
```

### 2. ビルド・デプロイ
```bash
# 本番ビルド
npm run build

# Vercel デプロイ
vercel --prod
```

### 3. 定期メンテナンス
```bash
# 依存関係更新
npm update

# セキュリティ監査
npm audit

# ブログ同期確認
node sync-blog.js
```

---

## 📝 Sanity ブログ運用詳細

### 🎛️ Sanity Studio 管理
1. **アクセス**: http://localhost:3333
2. **ログイン**: Sanityアカウント認証
3. **データ構造**:
   - `post`: ブログ記事
   - `category`: カテゴリー
   - `author`: 投稿者

### ✏️ 記事作成フロー
```
1. Sanity Studioで記事作成
   ├─ タイトル（必須）
   ├─ スラッグ（URL用、自動生成可）
   ├─ 公開日
   ├─ カテゴリー
   ├─ アイキャッチ画像
   └─ 本文（PortableText）

2. プレビューで確認

3. 公開設定

4. ウェブサイトに自動反映
```

### 🖼️ 画像管理
- **アップロード**: Sanity Studio内でドラッグ&ドロップ
- **最適化**: Sanity CDNが自動処理
- **推奨サイズ**: 幅800px以内、5MB以下
- **対応形式**: JPG, PNG, WebP

### 🔄 ブログ同期システム
```bash
# 自動同期実行
node complete-sanity-sync.js

# 手動同期（トラブル時）
node sync-new-posts.js

# データ修復
node fix-blog-data.js
```

---

## 🛠️ よく行う作業

### 📄 新規ページ追加
1. `app/` 配下にディレクトリ作成
2. `page.js` ファイル作成
3. メタデータ設定
4. ナビゲーション更新

### 🎨 スタイル変更
1. `styles/globals.css` でグローバル設定
2. コンポーネント別CSS Modules使用
3. レスポンシブ対応必須

### 🔧 コンポーネント追加
1. `components/` 配下に作成
2. TypeScript推奨
3. Props定義
4. エクスポート設定

---

## 🚨 トラブルシューティング

### ❌ 起動エラー
```bash
# Node.js バージョン確認（18以上必須）
node --version

# 依存関係再インストール
rm -rf node_modules package-lock.json
npm install
```

### 📝 ブログ表示エラー
```bash
# Sanity接続確認
node check-sanity-connection.js

# データ整合性チェック
node check-all-posts-proper.js

# 緊急修復
node fix-blog-data.js
```

### 🖼️ 画像表示エラー
- Sanity CDN接続確認
- 画像サイズ・形式確認
- Alt text設定確認

---

## 🔐 セキュリティ対策

### 🛡️ 実装済みセキュリティ
- Input validation
- CORS設定
-環境変数による機密情報保護
- CSRFトークン対応

### 🔑 重要な環境変数
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=qier3tei
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=（秘匿）
GOOGLE_SHEETS_CREDENTIALS=（秘匿）
```

### 📊 セキュリティ監査
```bash
# 脆弱性チェック
npm audit

# セキュリティ更新
npm audit fix
```

---

## 📚 重要ファイル解説

### 🔧 設定ファイル
- `package.json`: 依存関係・スクリプト
- `next.config.js`: Next.js設定
- `sanity.config.js`: Sanity設定
- `.env.local`: 環境変数

### 🏠 主要ページ
- `app/page.js`: ホームページ
- `app/blog/page.js`: ブログ一覧
- `app/blog/[slug]/page.js`: ブログ記事詳細
- `app/contact/page.js`: お問い合わせ

### 🔗 API
- `app/api/contact/route.js`: お問い合わせフォーム
- `lib/sanity.js`: Sanity クライアント設定

---

## 📈 パフォーマンス最適化

### ⚡ 実装済み最適化
- Next.js App Router使用
- 画像最適化（next/image）
- 静的生成（SSG）
- CDN配信（Sanity、Vercel）

### 📊 監視項目
- Core Web Vitals
- ページ表示速度
- SEOスコア
- アクセシビリティ

---

## 🔄 バックアップ・復元

### 💾 自動バックアップ
- Git によるコード管理
- Sanity Cloud自動バックアップ
- Vercel デプロイ履歴

### 🔙 復元手順
```bash
# 特定コミットに戻る
git checkout [commit-hash]

# Sanity データ復元
# Sanity Studio > Settings > Backup から復元
```

---

## 📞 緊急時対応

### 🆘 サイト停止時
1. Vercel ダッシュボード確認
2. ビルドログ確認
3. 前回動作版にロールバック
4. 根本原因調査

### 📧 お問い合わせ不具合
1. Google Sheets API接続確認
2. 環境変数確認
3. メール送信ログ確認

### 🖼️ 画像表示不具合
1. Sanity CDN ステータス確認
2. 画像ファイル整合性チェック
3. キャッシュクリア

---

## 📖 学習リソース

### 🔗 公式ドキュメント
- [Next.js](https://nextjs.org/docs)
- [Sanity](https://www.sanity.io/docs)
- [React](https://react.dev/)

### 📚 プロジェクト固有情報
- `README.md`: プロジェクト概要
- `SANITY-BLOG-SYSTEM-GUIDE.md`: ブログシステム詳細
- `SECURITY_GUIDELINES.md`: セキュリティガイドライン

---

## ⚠️ 重要な注意事項

### 🚫 絶対にしてはいけないこと
- 本番データベースの直接操作
- 環境変数をコミットに含める
- セキュリティ設定の無効化
- バックアップなしでの大幅変更

### ✅ 推奨作業手順
1. バックアップ作成
2. ローカルでテスト
3. ステージング環境で確認
4. 本番デプロイ
5. 動作確認

---

## 🎯 今後の発展方向

### 📈 機能拡張案
- 多言語対応
- 会員システム
- イベント管理
- 予約システム

### 🔧 技術改善案
- TypeScript完全移行
- テスト自動化
- CI/CD パイプライン
- パフォーマンス監視強化

---

**📅 作成日**: 2025年11月7日  
**✏️ 作成者**: Claude Code  
**🏷️ バージョン**: v1.0.0  
**🔄 引継ぎ先**: CODEX