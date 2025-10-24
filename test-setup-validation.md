# Setup Validation Test

This file was created to test the Copilot agent setup and validation workflows.

## Test Scenarios

### ✅ Branch Naming Convention
- Branch: `copilot/test/validate-setup`
- Follows pattern: `copilot/{type}/{description}`

### ✅ Commit Message Convention
- Using conventional commits with proper scope
- Example: `test(setup): add validation test file`

### ✅ Security Checks
- No secrets or credentials in this file
- Safe content only

### ✅ File Structure
- Documentation file (`.md`)
- Non-executable content
- Small file size

### ✅ PR Requirements
This PR will test:
- [ ] Automated CI checks run
- [ ] Security scanning passes
- [ ] Branch naming validation works
- [ ] PR template is used
- [ ] Code owner review is requested
- [ ] No protected files are modified

## Expected Outcomes

1. **CI Pipeline**: Should run all validation checks
2. **Security Scan**: Should pass with no vulnerabilities
3. **Agent Validation**: Should validate branch naming
4. **Review Assignment**: Should auto-assign @selfishthangs-ux

## Cleanup

This file should be deleted after successful testing.