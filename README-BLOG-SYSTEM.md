# 🌸 味美ネットワーク ブログ管理システム

## 📝 ブログ記事作成手順

### 1️⃣ Sanity Studioでブログを作成

**🌐 Sanity Studio URL:** https://ajiyoshi-network.sanity.studio/

#### ログイン方法:
1. 上記URLにアクセス
2. GoogleアカウントまたはSanityアカウントでログイン
3. **「Posts」** セクションで記事管理

#### 記事作成:
1. **「Create Post」** ボタンをクリック
2. 必須項目を入力:
   - **Title**: 記事タイトル
   - **Slug**: URL用のスラッグ（自動生成）
   - **Published at**: 公開日時
   - **Main Image**: サムネイル画像をアップロード
   - **Categories**: カテゴリ選択（活動報告/お知らせ）
   - **Body**: 記事本文（リッチテキスト対応）
   - **Excerpt**: 記事の要約（任意）

3. **画像の追加方法**:
   - Body内で画像ブロックを挿入
   - ドラッグ＆ドロップまたはアップロードボタンで画像追加
   - Alt text（代替テキスト）を設定

4. **「Publish」** で記事を公開

---

## 🔄 自動同期システム

### 📋 システム概要
Sanity Studioで作成した記事が**自動的に**味美ネットワークブログに反映されます。

### 🚀 手動同期コマンド
```bash
# 即座に同期実行
npm run sync:blog

# 定期同期開始（毎時0分に自動実行）
npm run sync:schedule
```

### ⚙️ 自動同期の仕組み
1. **Sanity API**から最新記事を取得
2. **画像URL**をSanity CDNから自動取得
3. **blog.html**内のJavaScriptデータを自動更新
4. **Git**に自動コミット・プッシュ
5. **Vercel**が自動デプロイ

---

## 🎯 利用手順（推奨フロー）

### ✍️ **新規記事作成時:**
1. https://ajiyoshi-network.sanity.studio/ でブログ作成
2. サムネイル画像と本文画像をアップロード
3. Publishで公開
4. `npm run sync:blog` で即座に同期
5. https://ajiyoshi-network.vercel.app/blog.html で確認

### 🔄 **定期運用:**
```bash
npm run sync:schedule
```
で定期同期を開始すれば、Sanityで記事公開後1時間以内に自動反映されます。

---

## 🛠️ システム設定

### 📊 環境変数（必要に応じて設定）
```bash
# .env.local（Sanity書き込みトークン）
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 🔧 Sanity Studio設定
```javascript
// vibe-blog-by-sanity/app/sanity.config.ts
projectId: 'qier3tei'
dataset: 'production'
```

---

## 🎨 対応機能

### ✅ **自動対応項目**
- ✅ サムネイル画像自動取得
- ✅ 本文内画像自動変換
- ✅ Portable Text → HTML変換
- ✅ カテゴリー・日付自動設定
- ✅ Git自動コミット
- ✅ Vercel自動デプロイ

### 📋 **記事表示内容**
- タイトル・日付・カテゴリ
- サムネイル画像
- 記事要約（抜粋）
- 本文（画像付き）
- レスポンシブデザイン

---

## 🎉 運用メリット

1. **🚀 簡単更新**: Sanity Studioの直感的エディタ
2. **⚡ 自動反映**: コーディング不要で即座に公開
3. **📱 レスポンシブ**: モバイル・デスクトップ両対応
4. **🖼️ 画像最適化**: Sanity CDNで高速配信
5. **🔄 バックアップ**: Git履歴で変更追跡
6. **⏰ 定期同期**: 完全自動運用も可能

---

## 🆘 トラブルシューティング

### 画像が表示されない場合:
1. Sanity Studioで画像が正しくアップロードされているか確認
2. `npm run sync:blog` で同期実行
3. ブラウザキャッシュをクリア（Ctrl+F5）

### 同期エラーの場合:
1. インターネット接続を確認
2. Sanityプロジェクト設定を確認
3. `npm install` で依存関係を再インストール

---

**🌸 味美ネットワーク ブログシステム完全対応！**