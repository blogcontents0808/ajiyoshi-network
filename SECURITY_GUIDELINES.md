# 🔐 セキュリティガイドライン: Git Push & ローカル作業制限

## 🚨 Git Push 機密情報保護対策

### 1. .gitignore 強化設定

現在の .gitignore は基本的な設定は済んでいますが、以下を追加推奨：

```gitignore
# 機密情報 - APIキー・認証情報
**/.env*
**/config/secrets.*
**/config/production.*
**/*secret*
**/*credential*
**/*key*.json
**/*private*.pem
**/*.p12
**/*.pfx

# Claude Code設定（ローカル専用）
**/.claude/settings.local.json
**/.claude/cache/

# 開発・デバッグファイル
**/debug.log
**/error.log
**/access.log
**/.env.backup
**/config.local.*

# バックアップファイル（機密情報含む可能性）
**/*.backup
**/*.bak
**/*.orig
**/backup_*
**/BACKUP_*

# データベースファイル
**/*.db
**/*.sqlite
**/*.sqlite3

# 一時作業ファイル
**/TODO_PRIVATE.md
**/NOTES_PRIVATE.md
**/WORK_IN_PROGRESS_*
```

### 2. Pre-commit フック設定

機密情報の誤コミットを防ぐための自動チェック：

```bash
# .git/hooks/pre-commit 作成
#!/bin/sh
echo "🔍 機密情報チェックを実行中..."

# APIキー・トークン検出
if git diff --cached --name-only | xargs grep -l "openai-api-key-" 2>/dev/null; then
    echo "❌ エラー: OpenAI APIキーが検出されました"
    exit 1
fi

if git diff --cached --name-only | xargs grep -l "stripe-key-" 2>/dev/null; then
    echo "❌ エラー: StripeキーやPinecone APIキーが検出されました"
    exit 1
fi

if git diff --cached --name-only | xargs grep -l "aws-access-key-" 2>/dev/null; then
    echo "❌ エラー: AWS認証情報が検出されました"
    exit 1
fi

# パスワード・秘密鍵検出
if git diff --cached --name-only | xargs grep -l "user-pwd.*=" 2>/dev/null; then
    echo "❌ エラー: パスワードが平文で検出されました"
    exit 1
fi

if git diff --cached --name-only | xargs grep -l "-----BEGIN.*PRIVATE KEY-----" 2>/dev/null; then
    echo "❌ エラー: 秘密鍵が検出されました"
    exit 1
fi

echo "✅ 機密情報チェック完了"
```

### 3. 環境変数管理ベストプラクティス

```bash
# ✅ 正しい管理方法
.env.local          # ローカル開発用（.gitignoreで除外）
.env.example        # 設定例（機密情報なし、Gitで管理）
.env.production     # 本番用（Vercel側で管理、Gitで除外）

# ❌ 避けるべき
.env               # 汎用的すぎる
config.js          # 機密情報を直接記述
hardcoded-keys.js  # ソースコードに直接記述
```

### 4. Git操作前の安全確認フロー

```bash
# Step 1: 変更内容確認
git diff --name-only          # 変更ファイル一覧
git diff                      # 変更内容詳細

# Step 2: 機密情報チェック
grep -r "openai-api-key" .   # APIキー検索
grep -r "user-pwd" .    # パスワード検索
grep -r "secret" .           # シークレット検索

# Step 3: 段階的コミット
git add [安全なファイルのみ]
git commit -m "..."
git push origin main
```

## 🔒 ローカル作業範囲制限設定

### 1. Claude Code設定による制限

`.claude/settings.local.json` に作業ディレクトリ制限を追加：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "workspaceRoot": "D:\\AI-SANDBOX",
  "permissions": {
    "allow": [
      "Bash(cd D:\\AI-SANDBOX*)",
      "Read(file_path:D:\\AI-SANDBOX*)",
      "Write(file_path:D:\\AI-SANDBOX*)",
      "Edit(file_path:D:\\AI-SANDBOX*)",
      "Glob(path:D:\\AI-SANDBOX*)",
      "Grep(path:D:\\AI-SANDBOX*)"
    ],
    "deny": [
      "Read(file_path:C:\\*)",
      "Read(file_path:D:\\Users\\*)",
      "Write(file_path:C:\\*)",
      "Edit(file_path:C:\\*)",
      "Bash(cd C:\\*)",
      "Bash(cd D:\\Users\\*)",
      "Bash(rm -rf /*)",
      "Bash(del C:\\*)",
      "Bash(del D:\\Users\\*)"
    ]
  }
}
```

### 2. PowerShell実行ポリシー制限

```powershell
# 現在のディレクトリ以外での実行を制限
Set-Location "D:\AI-SANDBOX"
$env:PWD = "D:\AI-SANDBOX"

# 危険なコマンドの無効化
Set-Alias rm $null -Force
Set-Alias del $null -Force
Set-Alias rmdir $null -Force
```

### 3. Windows 環境での追加保護

```cmd
REM バッチファイル作成: restrict_workspace.bat
@echo off
echo 🔒 ワークスペース制限を設定中...

REM 作業ディレクトリ固定
cd /d "D:\AI-SANDBOX"

REM 環境変数設定
set WORKSPACE_ROOT=D:\AI-SANDBOX
set ALLOWED_PATH=D:\AI-SANDBOX

REM Claude Code起動
echo ✅ ワークスペースをD:\AI-SANDBOXに制限しました
```

### 4. Git設定による制限

```bash
# リポジトリレベルでの安全設定
git config core.autocrlf true
git config core.safecrlf warn
git config push.default simple
git config pull.rebase false

# グローバル設定（必要に応じて）
git config --global user.email "secure@localhost"
git config --global user.name "SecureLocalUser"
```

## 🛡️ 監視・モニタリング設定

### 1. ファイル変更監視

```bash
# PowerShell でファイル変更監視
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "D:\AI-SANDBOX"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

Register-ObjectEvent $watcher "Created" -Action {
    $path = $Event.SourceEventArgs.FullPath
    if ($path -notlike "D:\AI-SANDBOX\*") {
        Write-Warning "⚠️ 許可範囲外でのファイル作成: $path"
    }
}
```

### 2. Git コミット前の自動スキャン

```bash
# git-secrets ツールの導入（推奨）
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install

# ルール設定
git secrets --register-aws
git secrets --install
```

## 📋 チェックリスト

### Git Push前の確認事項
- [ ] .env* ファイルが .gitignore に含まれている
- [ ] APIキー・パスワードが含まれていない
- [ ] 機密情報スキャンを実行済み
- [ ] コミットメッセージに機密情報なし
- [ ] pre-commit フックが動作確認済み

### 作業開始時の確認事項
- [ ] 作業ディレクトリが D:\AI-SANDBOX 配下
- [ ] Claude Code設定で制限が有効
- [ ] 危険なコマンドエイリアスが無効化済み
- [ ] 環境変数が適切に設定済み

---
**最終更新**: 2025年9月13日  
**目的**: Git機密情報保護 & ローカル作業範囲制限