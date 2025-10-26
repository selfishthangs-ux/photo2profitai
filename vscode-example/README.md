# VSCode Settings

This directory contains example VSCode settings for the project.

## Setup

To use these settings:

1. Copy this directory to `.vscode`:
   ```bash
   cp -r vscode-example .vscode
   ```

2. The `.vscode` directory is in `.gitignore`, so your personal settings won't be committed.

## Why is .vscode in .gitignore?

- **Personal preferences**: Everyone has different editor settings
- **System-specific paths**: Settings often contain absolute paths that won't work on other machines
- **Prevents conflicts**: Avoids merge conflicts in workspace settings
- **Security**: Prevents accidentally committing sensitive paths or configurations

## The VSCode Settings Error

If you see:
```
Unable to read file 'vscode-userdata:/User/settings.json'
```

This means your `.vscode` directory has invalid settings. Solutions:

1. Delete `.vscode` folder and start fresh
2. Copy from `vscode-example` 
3. Check for invalid file paths in your settings
4. Restart VSCode

**Note**: This error does NOT affect your code or deployment!

## Recommended VSCode Extensions

For the best development experience:

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Firebase** - Firebase tools integration
- **GitLens** - Enhanced Git capabilities
- **Error Lens** - Inline error highlighting
- **Path Intellisense** - Autocomplete for file paths

Install with:
```
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension toba.vsfire
code --install-extension eamodio.gitlens
```
