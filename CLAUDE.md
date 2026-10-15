# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A catalog of SolusIO 1-click applications (see README.md). There is no build, lint, or test tooling: each top-level directory is a self-contained application definition that SolusIO consumes via cloud-init. Changes are verified by deploying the app in SolusIO.

## Per-application layout

Each directory (e.g. `nginx/`, `plesk/`, `OpenClaw/`) contains some of:

- `application.json` — catalog metadata: `applications-slug`, `os`, `imageURL` (base VM image), `login-type` (`INFO`, `JS`, or HTML), `login-link` (path under `assets/`), `cloudinitversion`, and minimum CPU/RAM/disk.
- `form.json` — JSON Schema for the inputs the user fills in at deploy time (`domain`, `passwd`, etc.).
- `user-data.yaml` — cloud-init `#cloud-config`. Form values are injected with `{{ var }}` templating (e.g. `{{ domain }}`, `{{ passwd }}`, `{{ license }}`).
- `assets/login.html` / `assets/login.js` — post-deploy login/info page shown in the UI; also templated (`{{ ip }}`, `{{ passwd }}`, ...). `login.js` variants call `openWindow(url)` to open the app's admin login.
- `setup` (and `setup.ps1` for Windows Plesk) — optional bootstrap script, fetched at boot.

## Key architectural pattern

Heavier apps keep `user-data.yaml` thin: it writes templated values to `/root/config.ini` (via `write_files`), then `curl`s the `setup` script from `https://raw.githubusercontent.com/solusio/applications/master/<App>/setup`, runs it (sourcing `config.ini`), logs with timestamps, and deletes the config and script. Consequences:

- `setup` scripts are served from the **`master` branch on GitHub**, so changes there are not live until merged to master.
- The variables a `setup` script expects must match the `{{ }}` names in `user-data.yaml` and the properties in `form.json`; when adding a form field, update all three (plus `login.*` if it is shown to the user).
- Lighter apps (e.g. nginx, jenkins) inline everything in `user-data.yaml` with no `setup` file.
- `OpenClaw` has no form and uses `login-type: INFO`; its `setup` installs Node 22 and a pinned/`latest` `openclaw` npm package, creates an `openclaw` user and a systemd service, and logs to `/var/log/openclaw-install.log`.

## Public repo — keep internal details out

Everything here is public, and `setup` scripts are fetched from `raw.githubusercontent.com` by every deployment. Never add internal hostnames, credentials, internal image/registry URLs, Jira/Jenkins/CI links, or references to private repositories or internal tooling — in files, commit messages, or PR descriptions. Refer to tickets only as `SVM2-NNNN` (no Jira URL). Before committing, check that `application.json` `imageURL` values point to public hosts.

## Conventions

- New apps need `application.json`, `form.json` (if inputs are required), and `user-data.yaml`, and should be added to the list in README.md.
- Changes are merged into `master` via PRs. There is no PR template; the description should say which app changed and how it was tested.

## Git conventions

- Commit messages: `SVM2-NNNN Summary` (plain style, no `FIX`/`FEATURE`/`TASK` prefix), e.g. `SVM2-7180 Pin latest Openclaw version`.
- Branch names: `<type>-<author>-<summary>-SVM2-NNNN`, e.g. `fix-ibezuglov-pin-latest-openclaw-version-SVM2-7180`.
- Never push, merge a PR, or run `git reset --hard` without explicit permission.
- Stage files by name; never `git add .` or `git add -A`.
- Force-push only with `--force-with-lease --force-if-includes`.
- Don't add "fix previous commit" commits; use `git commit --fixup=<sha>` + `git rebase --autosquash`.
- Simple change → one commit. A change spanning several apps → one commit per app directory, or one per ticket.
