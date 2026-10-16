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
