# GitHub Actions Workflows

## Publish to npm

The `publish.yml` workflow automatically publishes the package to npm when changes are merged into the `main` branch.

### Setup Instructions

1. **Create an npm Access Token**:
   - Go to https://www.npmjs.com/settings/[your-username]/tokens
   - Click "Generate New Token"
   - Choose "Automation" token type (for CI/CD)
   - Copy the token (you won't see it again!)

2. **Add the Token to GitHub Secrets**:
   - Go to your repository: https://github.com/TheiaSurette/quickstart-cli/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

3. **Verify the Workflow**:
   - The workflow will run automatically when you push to `main` branch
   - Check the Actions tab: https://github.com/TheiaSurette/quickstart-cli/actions

### How It Works

1. **Triggers**: Runs on push to `main` branch when `package.json` changes
2. **Version Check**: Checks if the version already exists on npm (prevents duplicate publishes)
3. **Build & Test**: Builds the project and runs tests
4. **Publish**: Publishes to npm if version is new
5. **Release**: Creates a git tag and GitHub release

### Publishing a New Version

To publish a new version:

```bash
# Update version in package.json
npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
npm version minor  # for new features (1.0.0 -> 1.1.0)
npm version major  # for breaking changes (1.0.0 -> 2.0.0)

# Commit and push
git add package.json
git commit -m "chore: bump version to X.X.X"
git push origin main
```

The workflow will automatically:
- ✅ Build the project
- ✅ Run tests
- ✅ Publish to npm (if version is new)
- ✅ Create a git tag
- ✅ Create a GitHub release

### Troubleshooting

**Workflow doesn't run:**
- Ensure you're pushing to `main` branch
- Ensure `package.json` was modified in the commit

**Publish fails:**
- Check that `NPM_TOKEN` secret is set correctly
- Verify you have publish permissions for `@rh-ai-quickstart` organization
- Check npm logs in the Actions tab

**Version already exists:**
- The workflow will skip publishing if the version already exists
- Update the version in `package.json` and try again

