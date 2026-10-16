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
| Live site is Hugo output | `curl -sL https://hairathome.reverb256.ca/` -> `http 200`, `<meta name=generator content="Hugo 0.155.3">` (the April build, not this repo's pinned 0.140.2) |
| The live pages are frozen at the April deploy | `gh api repos/reverb256/hairathome/deployments` -> newest `environment: github-pages` = `ref: main`, sha `fec386e`, created `2026-04-14T15:18:28Z`; `curl -sD- https://hairathome.reverb256.ca/` -> `last-modified: Tue, 14 Apr 2026 15:18:45 GMT` |
| The live origin is `fec386e:docs/` byte-for-byte | diff of the live HTML against `git show fec386e:docs/index.html` shows only Cloudflare edge rewrites: `type="…-text/javascript"` attributes + `/cdn-cgi/…/rocket-loader.min.js` (Rocket Loader) and injected `/cf-fonts/` `@font-face` blocks (Cloudflare Fonts) |
| `main`'s `docs/` is the reproducible build output | on `main` (`7d57c18`), `npm ci && npm run build` with hugo extended 0.140.2 -> `git status --porcelain` empty (0 changed, 0 untracked); 32 pages, 156 static files |
| Publishing `main`'s `docs/` does not change the site content | live vs `fec386e:docs/index.html` vs `main:docs/index.html`: identical visible text (272 words, word-level diff 0 segments) and identical headings; only `og:image` differs (theme default after `e686431`) |
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

## Open items and their status

Updated 2026-10-16 by kanban `t_3f22909d` (follow-ups to the CI fix above).

1. **Deploy path - decision open, change ready.** `deploy.yml` used to publish
   only on `push: feature/astro-migration` + `workflow_dispatch`, so `main`
   pushes never republished the public site (live was frozen at `fec386e`,
   2026-04-14). A verified change that triggers on `push: main`, installs the
   pinned Hugo 0.140.2, runs `npm run build`, gates the upload on `docs/`
   matching that build, and drops the decorative `npx astro build` (writes
   `dist/`) and `generate-og-images.js` (writes `public/`) steps is open as
   **PR #24**. Merging it *is* the decision: the live site then follows `main`.
   Evidence in the PR body and in the table above.
   Not part of that PR: Pages has `https_enforced: false` and the domain is
   Cloudflare-proxied with Rocket Loader + Cloudflare Fonts enabled; enforcing
   HTTPS can interact with the Cloudflare SSL mode, so it is a separate call.
2. **`feature/astro-migration` cannot be judged by `astro-ci.yml` alone**: its
   own `npm run build` is `hugo --minify`, and `deploy-preview` publishes a
   committed `dist/`, so the branch does not actually build Astro either.
   Unchanged.
3. **Major dependency PRs: closed, and re-blocked at the source.** #22
   (astro 4 -> 7.2.8) and #23 (npm group incl. typescript 7.0.2) cannot install:
   `@astrojs/tailwind@6.0.2` peers `astro ^3 || ^4 || ^5`, and the latest
   `@astrojs/check@0.9.10` peers `typescript ^5 || ^6` (verified against the
   registry and in CI runs 38949577762 / 38949692235). Both are closed with that
   evidence, and `.github/dependabot.yml` now ignores major bumps of `astro`,
   `typescript`, and `tailwindcss` so the queue stops re-raising them. Delete
   those `ignore` entries when a real Astro/tailwind migration lands.
4. **Repo hygiene: done.** `hugo.tar.gz` (18 MB), `package.json.bak`,
   `tailwind.config.js.bak`, `.github/workflows/astro-ci.yml.bak`,
   `playwright-report/`, `test-results/`, `.hugo_build.lock` and the generated
   `.astro/` types are untracked, `.gitignore` covers them, and
   `.github/workflows/hygiene.yml` fails the build if any of them is tracked
   again. **Git history was not rewritten** (`hugo.tar.gz` is still in old
   commits, so the clone stays ~290 MB); rewriting `main` is destructive and was
   not done.
5. **Stale branches** (found while doing the above, not touched):
   `chore/remove-deprecated-integrations`, `prod`, `restore-astro-site` are all
   March/April-era and superseded by `main`.
6. **Minor**: `postcss` is configured twice (`postcss.config.js` uses the
   tailwind v4 plugin `@tailwindcss/postcss`, `postcss.config.cjs`/`.mjs` use v3
   `tailwindcss`), and `npm run build:css` is effectively a no-op: with
   `input.css` = `@tailwind base;` it emits the same 16 bytes it was given. The
   public CSS comes from the theme's Hugo assets. Harmless today; clean up with
   the tailwind v4 decision.
