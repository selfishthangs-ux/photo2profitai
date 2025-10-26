# Branch Rename Required

## Current Situation

**Current Branch:** `copilot/copilotfeatwhat-is-next-query`
**Required Pattern:** `copilot/{feat|fix|docs|refactor|test}/<description>`
**Recommended New Name:** `copilot/feat/what-is-next-query`

## Issue

The CI workflow (`ci.yml`) validates that Copilot agent branches follow the naming convention:
```
copilot/{feat|fix|docs|refactor|test}/<description>
```

The current branch name `copilot/copilotfeatwhat-is-next-query` does not match this pattern and will cause CI failures.

## Why Automatic Rename Failed

The Copilot agent environment has the following limitations:
- Cannot use `git push` directly (authentication restrictions)
- Must use `report_progress` tool which is tied to environment variables
- Environment variables (`GITHUB_REF`, `GITHUB_REF_NAME`) are set to the original (incorrect) branch name
- The `report_progress` tool respects these environment variables and pushes to the original branch

## Manual Steps Required

A repository maintainer with direct git access needs to perform the following steps:

### Option 1: Rename via Git (Recommended)

```bash
# Clone the repository (if not already cloned)
git clone https://github.com/selfishthangs-ux/photo2profitai.git
cd photo2profitai

# Fetch the current branch
git fetch origin copilot/copilotfeatwhat-is-next-query

# Check out the branch
git checkout copilot/copilotfeatwhat-is-next-query

# Rename the branch locally
git branch -m copilot/copilotfeatwhat-is-next-query copilot/feat/what-is-next-query

# Push the renamed branch
git push origin copilot/feat/what-is-next-query

# Delete the old branch from remote
git push origin --delete copilot/copilotfeatwhat-is-next-query

# Update the upstream tracking
git branch -u origin/copilot/feat/what-is-next-query
```

### Option 2: Create New PR with Correct Branch Name

Alternatively, create a new branch with the correct name and open a new PR:

```bash
# From the old branch
git checkout copilot/copilotfeatwhat-is-next-query

# Create new branch with correct name
git checkout -b copilot/feat/what-is-next-query

# Push the new branch
git push origin copilot/feat/what-is-next-query

# Open a new PR from the GitHub interface
# Close the old PR
# Delete the old branch
git push origin --delete copilot/copilotfeatwhat-is-next-query
```

### Option 3: Use GitHub Web Interface

1. Go to: https://github.com/selfishthangs-ux/photo2profitai/branches
2. Find the branch `copilot/copilotfeatwhat-is-next-query`
3. Unfortunately, GitHub doesn't support renaming branches directly through the UI
4. You'll need to use Option 1 or Option 2

## After Renaming

Once the branch is renamed:

1. **Update the Pull Request:** The PR will automatically update to track the new branch name (if using Option 1)
2. **Re-run CI:** The CI workflow should now pass the branch name validation
3. **Clean up:** Delete this instruction file and the branch rename note

## Files to Clean Up After Rename

- `.github/BRANCH_RENAME_NOTE.md`
- `.github/BRANCH_RENAME_INSTRUCTIONS.md`

## References

- CI Workflow: `.github/workflows/ci.yml` (lines 192-212)
- Branch validation regex: `^copilot/(feat|fix|docs|refactor|test)/.+`
