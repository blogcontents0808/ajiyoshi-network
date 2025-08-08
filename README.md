# 味美ネットワーク公式サイト

地域コミュニティ「味美ネットワーク」の公式ウェブサイトです。

## 🌐 サイトURL

- **本番サイト**: https://ajiyoshi-network.vercel.app/
- **ブログページ**: https://ajiyoshi-network.vercel.app/blog.html

## 🎯 Sanity Studio管理画面アクセス方法

### 📋 手順1: 管理画面を起動

```bash
# プロジェクトディレクトリに移動
cd "C:\Users\koichi yagi\OneDrive\Claude\ajiyoshi-network"

# Sanity Studio起動
npm run studio
```

### 📋 手順2: ブラウザでアクセス

起動後、以下のURLにアクセス：

**🌐 管理画面URL**: `http://localhost:3333`

### 🔧 起動時の表示例

```
Sanity Studio using vite@6.3.5 ready in 928ms and running at http://localhost:3333/
```

この表示が出たら正常に起動しています。

### 👤 ログイン方法

1. **ブラウザで `http://localhost:3333` を開く**
2. **Sanityアカウントでログイン**
   - 既存のSanityアカウントを使用
   - プロジェクト `qier3tei` へのアクセス権限が必要

### 📊 管理画面でできること

✅ **記事管理**
- 新規記事作成
- 既存記事編集
- 記事削除
- 公開/非公開設定

✅ **カテゴリ管理**
- カテゴリ追加・編集
- カテゴリ色設定

✅ **著者管理**
- 著者情報編集
- プロフィール画像設定

✅ **メディア管理**
- 画像アップロード
- 画像最適化

### ⚠️ 注意事項

- **ポート**: 3333番ポートを使用
- **同時実行**: メインサイト（3000番）と同時実行可能
- **停止方法**: `Ctrl + C` でStudio停止

### 🚨 トラブル時の対処

**エラーが出た場合:**
```bash
# 依存関係を再インストール
npm install

# 再起動
npm run studio
```

**ポート競合の場合:**
```bash
# 別ポートで起動
npx sanity dev --port 3334
```

## 📊 データベース情報

- **プロジェクトID**: qier3tei
- **データセット**: production  
- **API Version**: 2023-05-03
- **現在の記事数**: 6件
- **カテゴリ数**: 2件
- **著者数**: 3名

## 🛠 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript
- **CMS**: Sanity Studio v3.15.1
- **ホスティング**: Vercel
- **フレームワーク**: Next.js 14
- **データベース**: Sanity Content Lake

## 📝 開発・管理コマンド

```bash
# メインサイト開発サーバー起動
npm run dev

# メインサイトビルド
npm run build

# メインサイト本番起動
npm start

# Sanity Studio起動
npm run studio

# Sanity Studioビルド
npm run studio:build

# Sanity Studioデプロイ
npm run studio:deploy
```

## 🎉 プロジェクト完成状況

✅ **ブログシステム**: 100%完成  
✅ **レスポンシブデザイン**: 全デバイス対応済み  
✅ **管理画面**: Sanity Studio復旧完了  
✅ **本番稼働**: 安定稼働中  

---

**最終更新**: 2025年8月8日  
**復旧完了**: Sanity Studio管理画面