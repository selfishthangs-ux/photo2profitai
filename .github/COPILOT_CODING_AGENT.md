# Copilot coding agent — repository instructions

## Purpose & Scope
This document defines the guardrails and workflow conventions for an automated GitHub Copilot coding agent operating on this repository. It ensures safe, productive contributions while maintaining code quality and security standards.

## Repository at-a-glance
- **Repository**: `photo2profitai`
- **Default branch**: `main`
- **Current state**: Early-stage project with documentation-first approach
- **Build system**: None detected (as of initial setup)
- **Language/Framework**: TBD - maintainers should update this section when code is added

## Agent scope and mission
- Make small, safe, well-scoped improvements requested by humans (features, fixes, documentation, tests)
- Prefer minimal, incremental changes with appropriate test coverage
- Ask humans for clarification on ambiguous or broad requests before making large changes
- Maintain backward compatibility unless explicitly instructed otherwise

## Allowed automated actions

### ✅ Code & Documentation
- Create new branches for feature or fix work
- Add or update documentation files (`README.md`, files under `.github/`)
- Create or update source files for fully-specified small features or fixes
- Add/update unit and integration tests to cover new behavior
- Run linting, testing, and build checks before committing
- Comment on PRs with explanations of design decisions and implementation notes

### ✅ Git Operations
- Create feature branches following naming conventions
- Commit changes with descriptive, conventional commit messages
- Open pull requests with clear titles and comprehensive descriptions
- Merge PRs only after CI passes and human review is complete

## Disallowed actions

### ❌ Security & Secrets
- Do not access, commit, or modify secrets (`.env`, `*.key`, `*.pem`, credentials)
- Do not modify CI/CD settings, GitHub Actions secrets, or repository settings
- Do not execute network calls or external API writes without explicit approval

### ❌ Destructive Operations
- No force-pushing or rebasing protected branches (`main`, `dev`)
- No deleting files or directories without maintainer review
- No destructive changes to git history
- No pushing large binary files or vendor dependencies without approval

### ❌ Major Changes
- No architectural changes or major refactoring without human approval
- No adding major dependencies or changing build systems without review
- No modifying core configuration files (package.json, requirements.txt, etc.) without approval

## Branching conventions

### Branch naming patterns
```
copilot/feat/<short-description>     # New features
copilot/fix/<issue-number>-<desc>    # Bug fixes  
copilot/docs/<what>                  # Documentation updates
copilot/refactor/<module>            # Code refactoring
copilot/test/<feature>               # Test additions
copilot/chore/<task>                 # Maintenance, configuration, and planning tasks
copilot/query/<investigation>        # Investigation, analysis, and query tasks
```

### PR requirements
- PRs must merge into `main` only after CI passes and at least one human review
- All PRs require approval from a maintainer listed in `CODEOWNERS` (when available)
- No direct pushes to `main` - all changes via PR workflow

## Commit message conventions
Use conventional commits with imperative tense and clear scope:

```
feat(auth): add password reset validation
fix(api): resolve null pointer in user lookup  
docs(readme): update installation instructions
test(auth): add unit tests for login flow
refactor(utils): simplify date formatting logic
chore(deps): update security dependencies
query(analysis): investigate performance bottleneck
```

## Testing & validation requirements

### Pre-PR checklist
Before opening any PR, the agent must:
1. Run all available tests and ensure they pass
2. Run linting/formatting checks if configured
3. Verify no secrets or credentials are committed
4. Ensure documentation is updated for any API changes

### Test commands to try (in order)
When tests exist, run these commands before creating PRs:
1. `pytest` or `python -m pytest` (Python)
2. `npm test` or `yarn test` (Node.js)
3. `make test` (Makefile-based projects)
4. `cargo test` (Rust)
5. `go test ./...` (Go)

If no tests exist, include a note in the PR description: "No automated tests detected - manual testing recommended."

### Test coverage expectations
- New features should include unit tests covering happy path and edge cases
- Bug fixes should include regression tests
- Aim for meaningful test coverage, not just percentage targets

## CI and code quality

### Continuous Integration
- If GitHub Actions workflows exist, ensure all checks pass before merging
- When adding new CI workflows, keep them minimal and safe
- Never modify existing CI configuration without explicit maintainer approval

### Code quality standards
- Follow language-specific linting rules when present (ESLint, Flake8, etc.)
- Maintain consistent code formatting (Prettier, Black, etc.)
- Include meaningful comments for complex logic
- Update documentation for any public API changes

## PR review checklist
Every PR opened by the agent should include this checklist in the description:

```markdown
## Agent PR Checklist
- [ ] Follows naming conventions (branch, commits, files)
- [ ] All tests pass locally (or noted if none exist)
- [ ] Linting/formatting checks pass
- [ ] No hardcoded secrets or credentials
- [ ] Documentation updated for any API changes
- [ ] Minimal, focused changes with clear scope
- [ ] Backward compatibility maintained (unless breaking change approved)
```

## Files of interest
- `README.md` — project description and quick start
- `.github/` — workflows, issue/PR templates, and this guide
- `CODEOWNERS` — (when added) defines who reviews agent PRs
- `CONTRIBUTING.md` — (when added) coding standards and contribution guidelines

## Repository assumptions
- Early-stage project, currently documentation-first
- No detected package manager, build system, or tests (as of initial setup)
- **Action required**: When code is added, maintainers should update the "Language/Framework" section above

## Human oversight and escalation

### When to ask for approval
Create a draft PR or issue to request approval for:
- Adding major dependencies or changing build systems
- Architectural changes or major refactoring
- Modifying CI/CD workflows or repository settings
- Any change that affects multiple files or modules

### Escalation contacts
- Primary maintainers: Listed in `CODEOWNERS` file (to be created)
- For security concerns: Open an issue with "security" label
- For urgent issues: Mention `@selfishthangs-ux` (repository owner)

## Next steps for repository maintainers

### Immediate setup (recommended)
1. **Add `CODEOWNERS` file** listing primary maintainers for PR reviews
2. **Create basic GitHub Actions workflow** for linting and testing
3. **Add `CONTRIBUTING.md`** with coding standards and development setup

### Optional enhancements
4. Add PR and issue templates in `.github/` directory
5. Set up branch protection rules for `main` branch
6. Configure automated labeling for agent PRs
7. Add security policy (`SECURITY.md`) if handling sensitive data

### Integration with existing tools
- **Dependabot**: Configure for automated dependency updates
- **CodeQL**: Enable for security scanning
- **Status checks**: Require CI passage before merge

## Contact and feedback
- Repository owner: `@selfishthangs-ux`
- Update this file as the project evolves and requirements change
- Report issues with agent behavior by opening a GitHub issue

---

*This file follows the [Best practices for Copilot coding agent in your repository](https://gh.io/copilot-coding-agent-tips) guidelines.*
