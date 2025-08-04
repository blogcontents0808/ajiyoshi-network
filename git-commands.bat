@echo off
cd /d "C:\Users\fwin5\OneDrive\Claude\ajiyoshi-network"
echo === Initializing Git Repository ===
git init
echo.
echo === Checking Git Status ===
git status
echo.
echo === Adding All Files ===
git add .
echo.
echo === Checking Git Status After Add ===
git status
echo.
echo === Checking Recent Commits ===
git log --oneline -5
echo.
echo === Creating Commit ===
git commit -m "Complete ajiyoshi-network website with Next.js blog integration

- Added Next.js blog system with Sanity CMS
- Created static HTML pages for all sections
- Integrated navigation between blog and static pages
- Added responsive design and mobile support
- Implemented complete member list, history timeline, activities gallery
- Added contact form with proper styling
- Configured proper asset paths and styling

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
echo.
echo === Adding Remote Origin ===
git remote add origin https://github.com/blogcontents0808/ajiyoshi-network.git
echo.
echo === Pushing to GitHub ===
git push -u origin master
echo.
echo === All commands completed ===
pause