# Hair@Home

Hugo static site for Winnipeg mobile hair stylist.

## Commands

```bash
npm run serve    # Dev server at localhost:1313
npm run build    # Build to docs/
```

## Deploy

The live site (https://hairathome.reverb256.ca/) is Hugo output published from
`docs/`. `deploy.yml` runs on a push to `feature/astro-migration` and on manual
dispatch only, so a push to `main` does **not** republish the site today; a
change that makes `main` pushes deploy is open as PR #24. Read `STACK.md` before
changing that.

## Stack

Canonical stack, CI contract, and the lockfile rule: `STACK.md`.

## Structure

- `content/` - Markdown pages
- `themes/hairathome/` - Theme files
- `docs/` - Built site

## Info

- Phone: (204) 557-2287
- Payment: e-Transfer, Cash
- Service: Winnipeg, MB

---

# Git hygiene rules for every agent on this fleet

Status: shared rule block. Owner: Reverb. Source: `~/atlas-handoff/agent-git-rules.md`.

These rules are mandatory for all Hermes profiles, bots, and delegated agents.
They exist because an agent ran `git add -A` in a public repo and committed
`.freebuff/` session databases that held live Cloudflare OAuth tokens plus the
operator's real name and city.

## Stage explicit paths. Never stage a tree.

- Use `git add <path> [<path> ...]` with the paths you actually changed.
- Never run `git add -A`, `git add .`, `git add --all`, or `git commit -a`.
- Never use `git stash --include-untracked` as a shortcut before staging.

## Never commit tool or session state

Forbidden in any commit, at any depth:

    .freebuff/  .sisyphus/  .serena/  .playwright-mcp/  .codebuff/
    .cursor/    .claude/    .aider*   .hermes/          .opencode/
    .continue/  playwright-report/    .wrangler/        .dev.vars
    *.db  *.db-wal  *.db-shm  *.sqlite*  .env*  *.pem  *.key

A global exclude file blocks most of these, but the exclude list is a net, not
permission. If a path is not part of the change, do not stage it.

## Do not bypass the gates

- Never pass `--no-verify` to `git commit` or `git push`.
- Never set `core.hooksPath` to an empty directory inside a repo.
- Never delete or edit `~/.config/git/ignore` or anything in `~/.config/git/hooks/`.
- Never unset `core.excludesFile`.
- A blocked commit is a finding: report it to the operator. Do not retry with a
  different flag, do not rewrite the finding, do not edit the pattern list.

If a hook blocks work that is genuinely correct, stop and report it. The
operator decides.

## Identity

- Commit as `Reverb <129622142+reverb256@users.noreply.github.com>`.
- Never commit with a real-name or ISP-provided address.
- Never put the operator's real name, city, ISP mailbox, or the private LAN plan
  into a tracked file.

## Before you push

    git status --short          # read every line
    git diff --cached --stat    # confirm the staged set
    git log --oneline -3        # confirm the author identity

Install check on a host: `bash ~/.config/git/leakguard/doctor.sh` (17 checks).