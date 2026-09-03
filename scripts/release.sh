#!/usr/bin/env bash
set -Eeuo pipefail

# 每次發布只需要修改這一行，例如：VERSION="1.0.11"
VERSION="1.0.10"

BRANCH="main"
TAG="v${VERSION}"

die() {
  printf '錯誤：%s\n' "$1" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || die "找不到 git"
command -v npm >/dev/null 2>&1 || die "找不到 npm"
command -v gh >/dev/null 2>&1 || die "找不到 GitHub CLI（gh）"

[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]] || \
  die "VERSION 格式錯誤：${VERSION}"

CURRENT_BRANCH="$(git branch --show-current)"
[[ "$CURRENT_BRANCH" == "$BRANCH" ]] || \
  die "目前分支是 ${CURRENT_BRANCH:-detached HEAD}，請切換到 ${BRANCH}"

if git rev-parse --verify --quiet "refs/tags/${TAG}" >/dev/null; then
  die "本機 tag ${TAG} 已存在，請提高 VERSION"
fi

if git ls-remote --exit-code --tags origin "refs/tags/${TAG}" >/dev/null 2>&1; then
  die "遠端 tag ${TAG} 已存在，請提高 VERSION"
fi

if gh release view "$TAG" >/dev/null 2>&1; then
  die "GitHub Release ${TAG} 已存在，請提高 VERSION"
fi

printf '準備發布 %s\n' "$TAG"

# 同步 package.json 與 package-lock.json；不會下載或安裝套件。
npm version "$VERSION" --no-git-tag-version --allow-same-version

printf '執行程式檢查…\n'
npm run lint
npm run build

git add -A
git diff --cached --quiet && die "沒有可提交的變更"
git commit -m "release: ${TAG}"
git tag "$TAG"

printf '推送 main 與 %s…\n' "$TAG"
git push origin "$BRANCH" "$TAG"

printf '啟動 Windows、macOS、Linux Release 建置…\n'
gh workflow run release.yml \
  --ref "$BRANCH" \
  -f "tag=${TAG}" \
  -f "prerelease=false"

printf '\n已送出 %s。查看進度：\n' "$TAG"
printf '  gh run watch\n'
printf '完成後查看安裝檔：\n'
printf '  gh release view %s --web\n' "$TAG"
