# 味美ネットワーク ブログ デプロイガイド

## 🚀 デプロイ方法の選択

### 推奨デプロイ方法
1. **GitHub Pages** - 無料、簡単
2. **Vercel** - 高速、Next.js対応
3. **Netlify** - 使いやすい、無料枠あり

## 📂 GitHub Pages での公開

### 前提条件
- GitHubリポジトリが作成済み
- 変更内容がコミット済み

### 手順

#### 1. GitHubリポジトリの準備
```bash
# 変更をコミット
git add .
git commit -m "ブログシステムを追加"
git push origin main
```

#### 2. GitHub Pages の設定
1. GitHubリポジトリページにアクセス
2. `Settings` タブをクリック
3. 左サイドバーの `Pages` をクリック
4. `Source` を `Deploy from a branch` に設定
5. `Branch` を `main` に設定
6. `Save` をクリック

#### 3. 公開URL
- **メインサイト**: `https://yourusername.github.io/ajiyoshi-network/`
- **ブログ**: `https://yourusername.github.io/ajiyoshi-network/vibe-blog-by-sanity/app/`

### 注意事項
- 公開まで数分かかる場合があります
- 変更後は再度git pushが必要

## ⚡ Vercel での公開

### 前提条件
- Vercelアカウントの作成
- Node.js環境

### 手順

#### 1. Vercel CLIのインストール
```bash
npm install -g vercel
```

#### 2. プロジェクトのデプロイ
```bash
cd vibe-blog-by-sanity/app
vercel
```

#### 3. 設定の入力
```
? Set up and deploy "app"? Yes
? Which scope? (あなたのアカウントを選択)
? Link to existing project? No
? What's your project's name? ajiyoshi-network-blog
? In which directory is your code located? ./
? Want to override the settings? No
```

#### 4. 環境変数の設定（Sanity使用時）
```bash
# Vercelダッシュボードで設定
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

#### 5. 自動デプロイの設定
- GitHubリポジトリと連携
- mainブランチへのプッシュで自動デプロイ

## 🌐 Netlify での公開

### 方法1: ドラッグ&ドロップ
1. [Netlify](https://www.netlify.com/)にログイン
2. `vibe-blog-by-sanity/app` フォルダを管理画面にドラッグ&ドロップ
3. 自動でデプロイが開始

### 方法2: Git連携
1. Netlifyダッシュボードで `New site from Git` をクリック
2. GitHubリポジトリを選択
3. ビルド設定:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Base directory**: `vibe-blog-by-sanity/app`

## 🔧 カスタムドメインの設定

### 独自ドメインの取得
1. ドメイン取得サービスで独自ドメインを取得
   - 例：`ajiyoshi-network.com`

### DNS設定
```
# GitHub Pages の場合
A レコード: 185.199.108.153
A レコード: 185.199.109.153
A レコード: 185.199.110.153
A レコード: 185.199.111.153
CNAME: yourusername.github.io

# Vercel の場合
CNAME: cname.vercel-dns.com

# Netlify の場合
CNAME: your-site-name.netlify.app
```

## 🔒 HTTPS設定

### 自動HTTPS
- GitHub Pages: 自動で有効化
- Vercel: 自動で有効化
- Netlify: 自動で有効化

### Let's Encrypt証明書
すべてのプラットフォームで自動的に設定されます。

## 📊 パフォーマンス最適化

### 画像最適化
```html
<!-- 適切なサイズの画像を使用 -->
<img src="image.jpg" alt="説明" loading="lazy">
```

### キャッシュ設定
```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## 📈 SEO設定

### メタタグの設定
```html
<meta name="description" content="味美ネットワークの活動報告・お知らせ">
<meta property="og:title" content="味美ネットワーク ブログ">
<meta property="og:description" content="味美ネットワークの最新情報">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta property="og:url" content="https://yoursite.com">
<meta name="twitter:card" content="summary_large_image">
```

### サイトマップの生成
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2024-07-15</lastmod>
  </url>
  <url>
    <loc>https://yoursite.com/vibe-blog-by-sanity/app/</loc>
    <lastmod>2024-07-15</lastmod>
  </url>
</urlset>
```

## 🔍 デプロイ後の確認事項

### 動作確認チェックリスト
- [ ] メインサイトが正常に表示される
- [ ] ブログページが正常に表示される
- [ ] 記事詳細ページが正常に表示される
- [ ] 画像が正常に表示される
- [ ] リンクが正常に動作する
- [ ] スマートフォンで正常に表示される
- [ ] 表示速度が適切

### SEO確認
- [ ] Google Search Consoleに登録
- [ ] サイトマップを送信
- [ ] メタタグが正しく設定されている
- [ ] 構造化データが正しく設定されている

## 🚨 トラブルシューティング

### よくある問題と解決方法

**問題**: 画像が表示されない
**解決**: パスが正しいか確認、画像ファイルが存在するか確認

**問題**: CSSが適用されない
**解決**: CSSファイルのパスを確認、キャッシュをクリア

**問題**: デプロイが失敗する
**解決**: ビルドログを確認、依存関係を確認

**問題**: 404エラーが発生する
**解決**: ファイルパスとリンクが一致しているか確認

## 📞 サポート

デプロイでわからないことがあれば、技術担当者にお気軽にご相談ください。

---

© 2024 味美ネットワーク. All Rights Reserved.