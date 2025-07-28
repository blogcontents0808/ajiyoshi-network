# 📝 Sanity CMS連携 ブログ自動投稿システム セットアップガイド

## 🎯 システム概要

記事作成フォーム → Sanity CMS → Vercelサイト自動反映

## 📋 必要な手順

### 1. Sanity Write Token の取得

#### 1-1. Sanity Studioにアクセス
```
https://ajiyoshi-network.vercel.app/studio
```

#### 1-2. Sanity管理画面にログイン
- Sanityアカウントでログイン
- プロジェクト: `qier3tei`
- データセット: `production`

#### 1-3. API Tokenの作成
1. **設定** → **API** → **Tokens** に移動
2. **"Add API token"** をクリック
3. Token設定:
   - **Name**: `Blog Creator Token`
   - **Permissions**: **Write** を選択
   - **Dataset**: `production` を選択
4. **Save** をクリック
5. **重要**: 生成されたTokenをコピーして安全に保存

### 2. 初期データセットアップ（初回のみ）

#### 2-1. ブラウザのコンソールで実行
```javascript
// Tokenを設定（上記で作成したTokenを貼り付け）
window.setSanityToken('your-write-token-here');

// 初期データ（カテゴリ・著者）を作成
await window.setupSanityData();
```

### 3. 記事作成システムの使用

#### 3-1. 記事作成フォームにアクセス
```
C:\Users\koichi yagi\OneDrive\Claude\ajiyoshi-network\vibe-blog-by-sanity\app\blog-creator.html
```

#### 3-2. 記事作成手順
1. **Sanity Write Token** を入力
2. **接続テスト** ボタンで接続確認
3. 記事情報を入力:
   - タイトル
   - カテゴリ（お知らせ / イベント / 活動報告 / 重要）
   - 公開日
   - 記事概要
   - メイン画像（ドラッグ&ドロップ）
   - 記事本文（セクション別）
4. **記事を作成・公開** ボタンをクリック

#### 3-3. 投稿確認
- 投稿成功後、自動的にVercelサイトが開きます
- 数分後に新しい記事が反映されます

## 🔧 トラブルシューティング

### よくある問題と解決法

#### 問題: 「接続失敗」エラー
**原因**: Write Tokenが無効
**解決**: Sanity Studioで新しいTokenを作成

#### 問題: 「カテゴリが見つからない」エラー  
**原因**: 初期データが未作成
**解決**: `window.setupSanityData()` を実行

#### 問題: 画像アップロードエラー
**原因**: ファイルサイズが大きすぎる（5MB制限）
**解決**: 5MB以下の画像を使用、または画像を圧縮

#### 問題: 記事がVercelサイトに反映されない
**原因**: Vercelの再デプロイが必要
**解決**: 5-10分待つか、Vercelで手動再デプロイ

### デバッグ用コマンド

```javascript
// 接続テスト
await window.testSanityConnection();

// 初期データ再作成
await window.setupSanityData();

// Sanity記事一覧確認
await sanityBlogAPI.client.fetch('*[_type == "post"]');
```

## 📱 操作の流れ

```
1. blog-creator.html を開く
   ↓
2. Sanity Write Token を入力
   ↓
3. 接続テスト で確認
   ↓
4. 記事情報・画像をアップ
   ↓
5. 記事を作成・公開 をクリック
   ↓
6. Sanity CMS に自動投稿
   ↓
7. Vercel サイトに自動反映
```

## 🎨 カテゴリ色設定

- **お知らせ**: オレンジ (#FF6600)
- **イベント**: ブルー (#3498DB)  
- **活動報告**: グリーン (#27AE60)
- **重要**: レッド (#E74C3C)

## 🔒 セキュリティ注意事項

1. **Write Token の管理**:
   - Tokenは安全に保管
   - 他人と共有しない
   - 定期的にローテーション

2. **権限設定**:
   - 必要最小限の権限のみ付与
   - 不要になったTokenは削除

## 📞 サポート

問題が解決しない場合は、技術担当者にお問い合わせください。

---

© 2024 味美ネットワーク. All Rights Reserved.