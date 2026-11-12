@echo off
setlocal enabledelayedexpansion
REM ============================================================================
REM  OwnResume - one-click GitHub push (Windows)
REM ----------------------------------------------------------------------------
REM  Usage:
REM     github.bat                          -> stage all, commit, rebase, push
REM     github.bat "feat: new template"     -> same, with your own message
REM     github.bat "fix: nav" --build       -> lint + build first, then push
REM     github.bat --build                  -> verify, default message, push
REM
REM  What it does:
REM     1. checks this folder is the repo, and that "origin" exists
REM     2. switches to the target branch
REM     3. (--build) runs  npm ci  if node_modules is missing, then lint + build
REM     4. stages everything, commits (unless the tree is already clean)
REM     5. rebase-pulls origin, then pushes
REM
REM  Requires: git installed (and Node.js if you use --build).
REM ============================================================================

cd /d "%~dp0"

set "BRANCH=main"
set "MSG="
set "RUN_BUILD=0"

:parse
if "%~1"=="" goto parsed
if /i "%~1"=="--build" (
    set "RUN_BUILD=1"
) else if /i "%~1"=="-b" (
    set "RUN_BUILD=1"
) else if /i "%~1"=="--help" (
    goto :help
) else if /i "%~1"=="/?" (
    goto :help
) else if "!MSG!"=="" (
    set "MSG=%~1"
)
shift
goto :parse
:parsed

if "!MSG!"=="" set "MSG=chore: update site content and UI"

echo.
echo ============================================================
echo   OwnResume - GitHub push
echo   branch: !BRANCH!
echo   message: !MSG!
echo ============================================================
echo.

REM --- 1. Preflight ------------------------------------------------------------
where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] git was not found on PATH.
    echo         Install Git for Windows from https://git-scm.com/download/win
    goto :fail
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] This folder is not a git repository.
    echo         Put github.bat in the root of your cloned repo.
    goto :fail
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No "origin" remote configured.
    echo         Run: git remote add origin https://github.com/daniyal44/Resume-Builder.git
    goto :fail
)

REM --- 2. Branch ---------------------------------------------------------------
git rev-parse --verify "!BRANCH!" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Branch "!BRANCH!" not found locally - creating it.
    git checkout -b "!BRANCH!"
    if errorlevel 1 goto :fail
) else (
    git checkout "!BRANCH!" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Could not switch to "!BRANCH!".
        echo         Commit or stash the current changes first.
        goto :fail
    )
)

REM --- 3. Optional verification ------------------------------------------------
if "!RUN_BUILD!"=="1" (
    where npm >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] npm was not found on PATH - cannot run --build.
        goto :fail
    )
    if not exist "node_modules" (
        echo [1/5] Installing dependencies...
        call npm ci
        if errorlevel 1 goto :fail
    ) else (
        echo [1/5] Dependencies already installed - skipping npm ci.
    )
    echo [2/5] Linting...
    call npm run lint
    if errorlevel 1 (
        echo [ERROR] Lint failed - fix the errors above, then run again.
        goto :fail
    )
    echo [3/5] Building...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build failed - fix the errors above, then run again.
        goto :fail
    )
) else (
    echo [1/5] Verification skipped ^(pass --build to lint + build first^).
    echo [2/5] -
    echo [3/5] -
)

REM --- 4. Stage + commit -------------------------------------------------------
echo [4/5] Staging and committing...
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if not errorlevel 1 (
    echo        Nothing new to commit - skipping commit.
    goto :sync
)

git diff --cached --stat
git commit -m "!MSG!"
if errorlevel 1 goto :fail

:sync
REM --- 5. Rebase-pull, then push ----------------------------------------------
echo [5/5] Syncing with origin/!BRANCH! and pushing...
git pull --rebase --autostash origin "!BRANCH!"
if errorlevel 1 (
    echo.
    echo [WARN] Rebase pull failed. Nothing has been pushed.
    echo        Resolve the conflict, then run:
    echo            git rebase --continue
    echo            git push -u origin !BRANCH!
    goto :fail
)

git push -u origin "!BRANCH!"
if errorlevel 1 (
    echo.
    echo [ERROR] Push failed. Common causes:
    echo         - no network / GitHub unreachable
    echo         - diverged history:  git pull --rebase origin !BRANCH!
    echo         - not authenticated: sign in with Git Credential Manager,
    echo           or use a Personal Access Token as the password
    goto :fail
)

echo.
echo ============================================================
echo   Done. Changes pushed to origin/!BRANCH!.
echo   Repo: https://github.com/daniyal44/Resume-Builder
echo ============================================================
echo.
pause
exit /b 0

:help
echo.
echo   github.bat                      stage all, commit, rebase, push
echo   github.bat "feat: new template"  ...with your own commit message
echo   github.bat "fix: nav" --build    ...lint + build before pushing
echo.
pause
exit /b 0

:fail
echo.
echo ============================================================
echo   Push stopped. Read the message above.
echo ============================================================
echo.
pause
exit /b 1
