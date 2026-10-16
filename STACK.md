# Canonical stack decision (2026-10-16)

Status: decided, recorded by the CI-fix run for kanban task `t_ad03095f`
(ops dependabot sweep `t_5dcb5878`). Supersedes the stack ambiguity between
`main` and `feature/astro-migration`.

## Decision

**`main` is canonical. The public site is built with Hugo 0.140.2 + postcss +
tailwindcss v3, and it publishes to `docs/` (`publishDir = "docs"` in
hugo.toml).**

Astro is **not** the public build. `src/`, `astro.config.ts`, and the astro
packages in `package.json` are half-migrated work carried on
`feature/astro-migration`; nothing on `main` builds or serves them.

## Evidence

| Fact | How it was read |
|------|-----------------|
| Live site is Hugo output | `curl -sL https://hairathome.reverb256.ca/` -> `http 200`, `<meta name=generator content="Hugo 0.140.2">` |
| Source of the live site is `main` | `gh api repos/reverb256/hairathome/deployments` -> latest `environment: github-pages`, `ref: main` (sha `fec386e`) |
| Hugo is the deploy output | `hugo.toml`: `publishDir = "docs"`; `AGENTS.md`: "Hugo static site"; `npm run build` = `postcss ... && hugo --minify` |
| Astro is not built | `main` has no `astro build`/`astro:build` script and no astro output directory; the migration lives on `feature/astro-migration` |
| The migration is Astro **4**, not 7 | `git show origin/feature/astro-migration:package.json` -> `"astro": "^4.16.19"` |
| hugo build is reproducible in CI | local `npm run build` (postcss + hugo 0.140.2) exits 0 and leaves `docs/` byte-identical to the committed tree |

## Consequence for CI

`.github/workflows/astro-ci.yml` gates the canonical stack on `main`:

1. `lockfile-sync` - `npm ci` under node 22 (npm 10) **and** node 26 (npm 11).
2. `build-test` - `npm ci`, `npx astro check` (keeps the half-migrated
   `src/*.astro` type-clean and gives dependabot astro bumps a real signal),
   `npm run lint` (non-blocking: biome currently reports errors), `npm run build`
   (postcss + hugo -> `docs/`, uploaded as the `site` artifact).
3. Playwright E2E stays scoped to `feature/astro-migration` - `tests/basic.spec.ts`
   asserts that branch's markup and `playwright.config.ts` serves an Astro
   preview that `main` does not build.
4. `deploy-preview` is unchanged (push to `feature/astro-migration` only).

## Lock file rule

`package-lock.json` must stay installable by both npm majors in the fleet:

* node 22 -> npm 10 (GitHub runners, CI)
* node 26 -> npm 11 (nexus dev boxes)

Regenerate the lock file with **node 22 / npm 10** when possible, then confirm
with `npm ci` on both majors. The `lockfile-sync` job enforces this.

## Incident record: 2026-10-16 `npm ci` EUSAGE on main

* Symptom: `npm ci` on `main` failed with
  `EUSAGE ... Missing: esbuild@0.28.2 from lock file` (+ 27 `@esbuild/*`
  platform packages). Every open PR died at "Install dependencies"
  (example: run 38899288233, PR #21 - the tree it checked out was
  `a89f8ae` = `f340d20` + PR #21's workflow edits).
* Root cause: commit `f340d20` added `@astrojs/react@^7.0.1` (unused: no
  `.tsx`/JSX anywhere) next to `astro@^4.16.19`. `@astrojs/react@7` depends on
  `vite@^8.3.0`; the lock file nested `vite 8.3.4` under it, and `vite 8`
  declares `peerDependencies.esbuild: "^0.27.0 || ^0.28.0"`, which the tree does
  not contain. npm 11 (node 26) tolerated the unresolved peer; npm 10 (node 22,
  what CI uses) resolved it from the registry and refused to install.
  Reproduced locally: `npm ci` with npm 10.9.9 -> exit 1 with identical error;
  with npm 11.19.0 -> exit 0.
* Fix: dropped the unused `@astrojs/react` (package.json + astro.config.ts) and
  regenerated `package-lock.json` with npm 10.9.9. `npm ci` now exits 0 on both
  npm 10.9.9 and npm 11.19.0. `npx astro check` -> 0 errors. `npm run build` ->
  32 pages.

## Open items (not decided here)

* `deploy.yml` still publishes only on `push: feature/astro-migration` and
  uploads `./docs`; `main` pushes do not republish the public site. Fixing that
  changes what the live site serves, so it needs an explicit decision.
* `feature/astro-migration` cannot be judged by `astro-ci.yml` alone: its own
  `npm run build` is `hugo --minify`, and `deploy-preview` publishes a committed
  `dist/`, so the branch does not actually build Astro either.
* Major dependency PRs (#22 astro 4 -> 7, #23 npm group incl. typescript 7) are
  not compatible with the current integration set: `@astrojs/tailwind@6` peers
  `astro ^3 || ^4 || ^5`, and `@astrojs/check@0.9.10` peers `typescript ^5 || ^6`.
  Decide those together with a real Astro migration, not as drive-by bumps.
* Repo hygiene: `hugo.tar.gz` (18 MB), `package.json.bak`,
  `astro-ci.yml.bak`, `tailwind.config.js.bak`, `playwright-report/`,
  `test-results/` are committed at the root.
