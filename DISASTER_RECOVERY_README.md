# 🚨 緊急復旧手順: GitHub・Vercelからローカル環境復帰

## 概要
ローカルファイルが破損・紛失した場合に、GitHub・Vercelから完全復旧する手順書

## 🚀 緊急復旧プロセス

### STEP 1: GitHub からリポジトリ復旧
```bash
# 作業ディレクトリ作成
mkdir D:\AI-SANDBOX\ajiyoshi-network-recovery
cd D:\AI-SANDBOX\ajiyoshi-network-recovery

# GitHubからクローン
git clone https://github.com/blogcontents0808/ajiyoshi-network.git
cd ajiyoshi-network

# ブランチ確認
git status
git branch -a
```

### STEP 2: 依存関係インストール
```bash
# ルートレベル依存関係
npm install

# Sanityブログ依存関係（該当する場合）
cd vibe-blog-by-sanity/app
npm install
cd ../..
```

### STEP 3: 環境設定復旧
```bash
# 環境変数ファイル作成（必要に応じて）
touch .env.local
# 必要な環境変数を設定
```

### STEP 4: ローカルサーバー起動確認
```bash
# 開発サーバー起動
npm run dev
# または
PORT=3003 npm run start

# 動作確認URL
# http://localhost:3000 または http://localhost:3003
```

### STEP 5: Vercel設定確認・同期
```bash
# Vercel CLI インストール（未インストールの場合）
npm i -g vercel

# Vercelにログイン
vercel login

# 既存プロジェクトとリンク
vercel link

# Vercel環境変数取得
vercel env pull .env.local

# Vercelビルド設定確認
vercel inspect
```

## 🔧 重要なファイル・設定

### 必須確認ファイル
- `package.json` - 依存関係・スクリプト設定
- `next.config.js` - Next.js設定
- `vercel.json` - Vercel デプロイ設定
- `pages/api/contact/index.js` - APIエンドポイント
- `vibe-blog-by-sanity/app/lib/urlForImage.ts` - 画像URL生成（安全化済み）

### 環境変数チェックリスト
```bash
# 以下の環境変数が設定されているか確認
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET
echo $SANITY_API_TOKEN
# その他プロジェクト固有の環境変数
```

## 🚨 トラブルシューティング

### 画像URL生成エラー
```bash
# vibe-blog-by-sanity/app/lib/urlForImage.ts が存在するか確認
ls -la vibe-blog-by-sanity/app/lib/urlForImage.ts

# 存在しない場合、安全化版を再作成
cat > vibe-blog-by-sanity/app/lib/urlForImage.ts << 'EOF'
import { client } from "./sanity.client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  // Sanity設定が正しくない場合のフォールバック
  if (!client?.config()?.projectId) {
    console.warn('Sanity project ID not configured, using placeholder image');
    return '/images/placeholder.jpg';
  }
  
  if (!source?.asset?._ref) {
    return '/images/placeholder.jpg';
  }
  
  try {
    return builder.image(source).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '/images/placeholder.jpg';
  }
}
EOF
```

### APIエンドポイントエラー
```bash
# CORS設定確認
grep -n "localhost:3003" pages/api/contact/index.js

# 存在しない場合、CORS設定追加
# allowedOrigins配列に 'http://localhost:3003' を追加
```

### ポート競合
```bash
# 使用中ポート確認
netstat -ano | findstr :3000
netstat -ano | findstr :3003

# プロセス終了（PID確認後）
taskkill /PID [PID番号] /F
```

## 🔄 GitHub・Vercel状態との同期確認

### GitHub最新状態確認
```bash
git fetch origin
git status
git log --oneline -5

# 最新コミットとの差分確認
git diff HEAD origin/main
```

### Vercel本番環境確認
```bash
# Vercel本番URL動作確認
curl -I https://ajiyoshi-network.vercel.app

# デプロイ状況確認
vercel ls
vercel logs
```

## 📋 復旧完了チェックリスト

- [ ] GitHubからリポジトリクローン完了
- [ ] 依存関係インストール完了
- [ ] 環境変数設定完了
- [ ] ローカルサーバー起動成功
- [ ] メインページ (/) 表示確認
- [ ] ブログページ (/blog.html) 表示確認
- [ ] APIエンドポイント (/api/contact) 動作確認
- [ ] Vercel連携確認
- [ ] 画像表示正常（プレースホルダー含む）

## 🎯 最終動作確認URL

```
http://localhost:3000/         # メインページ
http://localhost:3000/blog.html    # ブログ
http://localhost:3000/api/contact  # API確認
```

---
**最終更新**: 2025年9月13日  
**作成理由**: ローカル環境破損時の緊急復旧対応