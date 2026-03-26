# @kvdenis/ts-sum-package

A simple TypeScript package with a fully automated CI/CD pipeline using GitHub Actions.

## Package

```ts
import { sum } from '@kvdenis/ts-sum-package';

sum(2, 3); // 5
```

## CI/CD Pipeline

### PR Validation (every PR)

On every pull request to `main` the pipeline runs:

1. **Linear history check** — no merge commits allowed in the branch
2. **Branch up-to-date check** — branch must contain the latest `main`
3. **Lockfile check** — `package-lock.json` must be present
4. **Install, lint, build, unit tests**

The PR cannot be merged unless all checks pass.

### Labels

**`verify`** — triggers integration/E2E tests (runs after validation passes).

**`publish`** — triggers the release candidate flow:
- Validates that `package.json` version was bumped
- Checks that the version does not already exist on npm
- Builds the package with a dev suffix (e.g. `1.2.0-dev-abc1234`)
- Uploads the `.tgz` artifact
- Comments on the PR with build details

### Release on Merge

When a PR with the `publish` label is merged into `main`:

1. Package is published to npm (via trusted publishing / OIDC)
2. Git tag `vX.Y.Z` is created
3. GitHub Release is created with a generated changelog

Order matters: publish first, then tag — if publish fails, no orphan tags are left.

### Branch Protection

Branch protection is configured automatically via `setup-branch-protection.yml` (workflow_dispatch). It enforces:

- Status checks must pass (`Validate PR`)
- At least 1 approving review
- Linear history required
- Branch must be up-to-date with `main`

Run once after creating the repository:

```bash
gh workflow run setup-branch-protection.yml
```

Requires a PAT with admin permissions stored as `ADMIN_TOKEN` in repository secrets.

## How to Release

### Using the helper script

```bash
./scripts/create-release.sh patch   # 1.0.0 → 1.0.1
./scripts/create-release.sh minor   # 1.0.0 → 1.1.0
./scripts/create-release.sh major   # 1.0.0 → 2.0.0
```

The script creates a branch, bumps the version, pushes, and opens a PR with `publish` and `verify` labels.

### Manual process

1. Create a branch from `main`
2. Make changes
3. Bump version: `npm version patch --no-git-tag-version`
4. Commit and push
5. Create a PR, add `publish` label (and optionally `verify`)
6. Wait for checks, get review, merge
7. Automation handles the rest

## Setup (first time)

1. Publish the first version manually: `npm publish --access public`
2. Configure trusted publishing on npmjs.com: Settings → Trusted Publisher → GitHub Actions → fill in `deniskv`, `ts-sum-package`, `publish.yml`
3. Add `ADMIN_TOKEN` (PAT with admin scope) to repository secrets
4. Run `gh workflow run setup-branch-protection.yml`

## Reusable Actions

This project uses composite actions from [deniskv/reusable-cicd-actions](https://github.com/deniskv/reusable-cicd-actions):

- `check-linear-history` — verifies no merge commits in PR branch
- `check-branch-updated` — verifies branch is up-to-date with main
- `check-version-bump` — verifies version was bumped in package.json
- `generate-changelog` — generates changelog from git commits

## License

MIT
