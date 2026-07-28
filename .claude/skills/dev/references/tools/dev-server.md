# 開発サーバの起動

UI 検証のために dev server を起動する時の手順。起動はメインプロセス（fable / sonnet）の責務。worker / loop はサーバを起動しない。呼び出し元が渡した URL をそのまま使う。

dev server は main checkout の 1 本のみ。worktree では起動しない（worktree サーバは `.env` 欠落・未 seed DB・止め忘れの温床。2026-07-21 の運用で確認して禁止）。dev server が要る案件は worktree を使わず main checkout のブランチで作業する（request.md の Branch を参照）。

## 起動前に必ず確認すること

まず既にサーバが起動していないか確認する。対象 URL（portless 経由なら `https://{app}.localhost`、それ以外なら既知の `localhost:{port}`）に軽くリクエストを送って応答があれば、それを使う。新規に起動しない。

判断できない時は `ps aux` や `lsof -i :{port}` でプロセスを確認してから判断する。二重起動はポート衝突・cookie / storage の汚染を招く。

## portless の確認

対象リポジトリのルートに `portless.json` があるか確認する。

あれば、portless 経由で起動する（`portless --script dev`、または `portless.json` の `apps` に登録された名前で `https://{name}.localhost` に出る）。ポート番号は使わない。

無ければ、勝手にセットアップせずオーナーに案内して確認を取る。`trust` と `service install` は sudo / 管理者パスワードが要るため Claude 側では実行できない。案内する手順は次の3つ。

```bash
vp i portless -g        # グローバルインストール（Claude が実行してよい）
portless trust           # CA 信頼登録。sudo が要るためオーナーが実行
portless service install # LaunchDaemon 登録。管理者パスワードが要るためオーナーが実行
```

案内だけして、オーナーの返答を待つ。portless 無しでそのまま `npm run dev` 等を直接叩いて進めるかどうかもオーナーの判断に委ねる。

## 起動後

自分が新規に起動したサーバであっても、検証が終わったからといって勝手に落とさない。他の作業やオーナーが引き続き使っている可能性がある。停止が必要な場面が出たら、落としていいか確認してから止める。

既に起動していたサーバ（自分が起動していないもの）には一切触らない。再起動・停止どちらもしない。
