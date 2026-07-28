# GitHub リポジトリ運用

Issue / PR の書式ではなく、リポジトリそのものの設定と衛生を保つ運用ルール。書式は [gh-templates.md](gh-templates.md) を参照する。

## リポジトリ設定の確認

リポジトリで PR 操作を始める前に、head ブランチの自動削除が有効か確認する。無効なら有効化する。これが無効だと squash マージ後のブランチがリモートに溜まり続ける。

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh api "repos/$REPO" -q .delete_branch_on_merge
# false なら有効化する
gh api -X PATCH "repos/$REPO" -F delete_branch_on_merge=true
```

## ブランチの棚卸し

squash マージされたブランチは `git branch --merged` に現れない（マージコミットを共有しないため）。ローカルブランチを消す前に、対応する PR の状態で判定する。

```bash
gh pr list --head "$BRANCH" --state all --json state -q '.[0].state'
# MERGED なら git branch -D で消してよい
```

PR を持たないブランチは、tip のコミット件名と差分を main と突き合わせ、重複作業の残骸なら消す。判断がつかないものは残して報告する。

## worktree の掃除

マージ済みブランチに紐づく worktree は `git worktree remove` で片付ける。`git worktree list` に残った detached / 古い日付のエントリは棚卸しの対象にする。
