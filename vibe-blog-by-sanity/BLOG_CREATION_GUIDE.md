# 味美ネットワーク ブログ作成ガイド

## 🎯 目的
味美ネットワークの活動報告やお知らせを効率的に発信するためのブログシステムの使用方法を説明します。

## 📝 現在のHTMLベースでの記事作成方法

### 新しい記事を作成する手順

#### 1. テンプレートファイルの準備
```bash
# blog-template.html をコピーして新しい記事を作成
cp blog-template.html post-YYYY-MM-DD-title.html
```

#### 2. 記事内容の編集
以下の箇所を編集してください：

**ヘッダー部分:**
```html
<title>記事タイトル｜味美ネットワーク</title>
<meta name="description" content="記事の概要">
```

**記事ヘッダー:**
```html
<h1>記事タイトル</h1>
<time>2024年7月20日</time>
<span class="blog-post-category">カテゴリ名</span>
```

**画像:**
```html
<img src="../../images/画像ファイル名" alt="記事タイトル" class="blog-post-image">
```

**記事本文:**
```html
<div class="blog-post-content">
    <p>記事の導入文</p>
    
    <h2>見出し1</h2>
    <p>内容</p>
    
    <h3>小見出し</h3>
    <ul>
        <li>リスト項目1</li>
        <li>リスト項目2</li>
    </ul>
    
    <h2>見出し2</h2>
    <p>内容</p>
</div>
```

#### 3. 一覧ページに追加
`index.html`に新しい記事カードを追加：

```html
<article class="blog-post-card">
    <img src="../../images/画像ファイル名" alt="記事タイトル" class="blog-post-image">
    <div class="blog-post-content">
        <div class="blog-post-meta">
            <time class="blog-post-date">2024年7月20日</time>
            <span class="blog-post-category">カテゴリ名</span>
        </div>
        <h2 class="blog-post-title">
            <a href="post-YYYY-MM-DD-title.html">記事タイトル</a>
        </h2>
        <p class="blog-post-excerpt">記事の概要文</p>
        <div class="blog-post-footer">
            <div class="blog-post-author">
                <img src="../../images/kantaro_yoroshiku.png" alt="味美ネットワーク">
                <span>味美ネットワーク</span>
            </div>
            <a href="post-YYYY-MM-DD-title.html" class="blog-post-readmore">続きを読む →</a>
        </div>
    </div>
</article>
```

### カテゴリー別の色設定

```html
<!-- お知らせ: デフォルトのオレンジ -->
<span class="blog-post-category">お知らせ</span>

<!-- イベント: ブルー -->
<span class="blog-post-category" style="background-color: #3498DB;">イベント</span>

<!-- 活動報告: グリーン -->
<span class="blog-post-category" style="background-color: #27AE60;">活動報告</span>

<!-- 重要: レッド -->
<span class="blog-post-category" style="background-color: #E74C3C;">重要</span>
```

## 🖼️ 画像管理について

### 画像の追加方法
1. 画像ファイルを `../../images/` フォルダに保存
2. ファイル名は分かりやすい名前を付ける
   - 例：`summer-festa-2024.jpg`、`sakura-matsuri-2024.jpg`

### 推奨画像サイズ
- **記事サムネイル**: 600×400px
- **記事詳細画像**: 1200×600px
- **ファイル形式**: JPG、PNG
- **ファイルサイズ**: 500KB以下を推奨

### 画像最適化のヒント
```html
<!-- 適切なalt属性を設定 -->
<img src="../../images/event-photo.jpg" alt="サマーフェスタ味美2024の様子" class="blog-post-image">
```

## 📱 記事公開前のチェックリスト

### 必須チェック項目
- [ ] タイトルが適切に設定されている
- [ ] 日付が正しく設定されている
- [ ] カテゴリが設定されている
- [ ] 記事本文が完成している
- [ ] 画像のalt属性が設定されている
- [ ] 一覧ページに記事カードが追加されている
- [ ] リンクが正しく動作している

### SEO対策チェック
- [ ] メタディスクリプションが設定されている
- [ ] 見出し構造が適切（h1→h2→h3の順）
- [ ] 画像のalt属性が適切
- [ ] 記事の概要文が分かりやすい

## 🚀 将来のSanity CMS移行について

### Sanity CMSの利点
- **リアルタイム更新**: 記事をすぐに公開可能
- **画像最適化**: 自動的に画像を最適化
- **リッチエディタ**: 見やすいエディタで記事作成
- **マルチユーザー**: 複数人での記事管理
- **バックアップ**: 自動バックアップ機能

### 移行のタイミング
1. **現在**: HTMLベースでの記事作成
2. **短期**: Sanity CMSの環境構築
3. **中期**: 本格的な記事作成・管理
4. **長期**: 高度な機能の追加

## 💡 記事作成のコツ

### 効果的な記事タイトル
- 具体的で分かりやすい
- 日付を含める（イベント系）
- 感情を込める（「開催しました」「始まりました」）

### 読みやすい記事構成
1. **導入**: 何についての記事か
2. **本文**: 詳細な内容
3. **まとめ**: 今後の予定や感謝の言葉

### 画像の効果的な使用
- 記事の内容を補完する画像
- 人物の表情が見える写真
- 明るく魅力的な写真

## 🔧 トラブルシューティング

### よくある問題と解決方法

**問題**: 画像が表示されない
**解決**: ファイルパスを確認（`../../images/`）

**問題**: リンクが動作しない
**解決**: ファイル名とリンクが一致しているか確認

**問題**: レイアウトが崩れる
**解決**: HTMLタグが正しく閉じられているか確認

## 📞 サポート

記事作成でわからないことがあれば、技術担当者にお気軽にご相談ください。

---

© 2024 味美ネットワーク. All Rights Reserved.