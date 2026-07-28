# /product:dev:dev skills

対象リポジトリの技術スタックを見て、役に立ちそうな Skill パッケージを自動で追加する。`/product:dev skills` を呼ぶこと自体がオーナーの承認なので、候補ごとに個別確認はしない。

## 起動条件

`/product:dev skills` で起動する。引数は取らない。

## スタック判定

`package.json` の dependencies / devDependencies を読み、該当があれば候補に挙げる。

- `react` があれば `millionco/react-doctor` の `react-doctor` skill を候補にする
- `components.json` が存在する、または dependencies に shadcn 関連パッケージ（`shadcn`、`shadcn-ui`）があれば `shadcn/ui` の `shadcn` skill を候補にする
- `wrangler` が dependencies / devDependencies にある、または `wrangler.toml` / `wrangler.jsonc` がリポジトリ直下にあれば `cloudflare/skills` の `wrangler` `workers-best-practices` `cloudflare` skill を候補にする

該当が無ければ「対象なし」で終了する。無理に候補をひねり出さない。判定基準に無いスタックを見つけても、根拠のある対応パッケージが分からなければ候補にしない。

## 追加

判定できた候補を `vpx skills add <owner>/<repo> --agent claude-code --skill <skill名...> -y` でそのまま追加する。個別の確認は挟まない。`--agent` と `--skill` を明示し `-y` を付けることで確認プロンプトなしの非対話実行になる。`--skill` は複数指定できる（スペース区切り）。

```bash
vpx skills add millionco/react-doctor --agent claude-code --skill react-doctor -y
vpx skills add shadcn/ui --agent claude-code --skill shadcn -y
vpx skills add cloudflare/skills --agent claude-code --skill wrangler workers-best-practices cloudflare -y
```

`--skill` を付けずに実行しない。`--list` オプションは使わない。ドキュメント上は「インストールせず一覧表示するだけ」だが、エージェント検出下では実際にはパッケージ内の全 skill をインストールしてしまう（2026-07-20 実機確認）。skill 名が変わってコマンドがエラーを返したら、実行を止めて何が起きたかをオーナーに報告する。

追加後、`vpx skills list` で反映を確認する。

## 報告

追加した skill を一覧で報告する。何を根拠に判定したか（`react` 依存を検出、`wrangler.toml` を検出、等）も添える。

## 禁止事項

- `--skill` を省略した `vpx skills add <owner>/<repo>` を実行しない（skill 名未指定だとパッケージ内の全 skill が対象になりうる）
- `--list` で skill 名を確認しようとしない（実際にはインストールされる）
- 該当が無いのに候補を作らない
- スタック判定に使わなかった根拠（勘・一般論）で候補を挙げない
