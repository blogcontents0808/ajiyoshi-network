# 味美ネットワーク ブログ セットアップガイド

## 🚀 プロジェクトの起動方法

### 前提条件
- Node.js 18以上がインストールされていること
- npm または yarn がインストールされていること

### 手動セットアップ手順

#### 1. 依存関係のインストール
```bash
# プロジェクトディレクトリに移動
cd ajiyoshi-network/vibe-blog-by-sanity/app

# 依存関係をインストール
npm install
```

#### 2. 環境変数の設定（オプション）
```bash
# .envファイルを作成（本番環境の場合）
echo "NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id" > .env.local
echo "NEXT_PUBLIC_SANITY_DATASET=production" >> .env.local
echo "SANITY_API_TOKEN=your-api-token" >> .env.local
```

**注意**: 環境変数が設定されていない場合、自動的にモックデータが使用されます。

#### 3. 開発サーバーの起動
```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

#### 4. Sanity Studio の起動（オプション）
```bash
# 別のターミナルで Sanity Studio を起動
npm run studio
```

ブラウザで http://localhost:3333 にアクセスしてSanity Studioを使用できます。

### 🛠️ トラブルシューティング

#### Bashコマンドエラーが発生する場合
MINGW64環境でのパス問題により、Bashコマンドが実行できない場合があります。
この場合は、以下の手動手順を実行してください：

1. **PowerShellまたはコマンドプロンプトを使用**
   ```cmd
   cd ajiyoshi-network\vibe-blog-by-sanity\app
   npm install
   npm run dev
   ```

2. **Git Bashを使用する場合**
   ```bash
   cd ajiyoshi-network/vibe-blog-by-sanity/app
   npm install
   npm run dev
   ```

#### ポート競合の解決
```bash
# ポート使用状況確認
netstat -ano | findstr :3000

# プロセス停止（PowerShell）
Stop-Process -Id [PID] -Force
```

#### 依存関係の問題
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 📁 プロジェクト構造

```
ajiyoshi-network/vibe-blog-by-sanity/
├── app/                    # Next.jsアプリケーション
│   ├── app/               # App Router
│   ├── lib/               # ユーティリティとAPI
│   │   ├── sanity.ts      # Sanityクライアント（フォールバック機能付き）
│   │   └── mockData.ts    # モックデータ
│   ├── components/        # Reactコンポーネント
│   ├── schemaTypes/       # Sanityスキーマ
│   └── package.json       # 依存関係
├── contents/              # コンテンツソース
│   ├── posts/            # Markdown記事
│   └── common/           # 共通設定
└── tools/                # ビルド・デプロイツール
```

### 🎯 開発フロー

1. **開発環境での作業**
   - 環境変数なしでモックデータを使用
   - http://localhost:3000 でブログを確認

2. **Sanityプロジェクトの設定**
   - Sanityアカウントでプロジェクトを作成
   - プロジェクトIDを環境変数に設定
   - http://localhost:3333 でStudioを使用

3. **コンテンツのインポート**
   ```bash
   npm run import-contents
   ```

4. **本番デプロイ**
   ```bash
   npm run build
   # または
   npm run deploy
   ```

### 🔧 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLintチェック |
| `npm run studio` | Sanity Studio起動 |
| `npm run studio:build` | Studio ビルド |
| `npm run studio:deploy` | Studio デプロイ |
| `npm run import-contents` | コンテンツインポート |

### 🎨 特徴

- **フォールバック機能**: Sanityプロジェクト未設定でも動作
- **モックデータ**: 開発環境ですぐに確認可能
- **レスポンシブデザイン**: モバイル・タブレット対応
- **SEO最適化**: メタタグとStructured Data対応
- **画像最適化**: プレースホルダー画像自動生成

### 📝 注意事項

1. **本番環境では必ずSanityプロジェクトIDを設定してください**
2. **モックデータは開発環境でのみ使用してください**
3. **APIトークンは環境変数で管理し、コミットしないでください**

---

**作成日**: 2024年7月15日  
**更新日**: 2024年7月15日  
**バージョン**: 1.0.0