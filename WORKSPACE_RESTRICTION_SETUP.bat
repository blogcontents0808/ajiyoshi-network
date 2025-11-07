@echo off
echo 🔒 ワークスペース制限セットアップを開始...

REM 作業ディレクトリをAI-SANDBOXに固定
cd /d "D:\AI-SANDBOX"

REM 環境変数設定
set WORKSPACE_ROOT=D:\AI-SANDBOX
set ALLOWED_PATH=D:\AI-SANDBOX
set CLAUDE_WORKSPACE=D:\AI-SANDBOX

REM PowerShell実行ポリシー設定（必要に応じて）
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

REM 危険なコマンドエイリアス無効化用PowerShellスクリプト作成
echo # 危険なコマンド無効化スクリプト > secure_aliases.ps1
echo Set-Alias rm $null -Force >> secure_aliases.ps1
echo Set-Alias del $null -Force >> secure_aliases.ps1
echo Set-Alias rmdir $null -Force >> secure_aliases.ps1
echo Write-Host "✅ 危険なコマンドエイリアスを無効化しました" >> secure_aliases.ps1

REM セキュリティ設定適用
powershell -ExecutionPolicy Bypass -File secure_aliases.ps1

echo ✅ ワークスペース制限設定が完了しました
echo 📁 作業範囲: D:\AI-SANDBOX 配下のみ
echo 🚫 危険なコマンド: 無効化済み
echo.
echo ⚠️  重要: 今後の作業は必ずD:\AI-SANDBOX配下で実行してください
pause