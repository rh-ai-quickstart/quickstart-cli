# Publishing Guide

## Prerequisites

1. **npm Account**: Sign up at https://www.npmjs.com/signup
2. **npm Organization**: Create `rh-ai-quickstart` org at https://www.npmjs.com/org/create
3. **Authentication**: Log in via CLI

## Step-by-Step Publishing Process

### 1. Authenticate with npm

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### 2. Ensure You're a Member of the Organization

If you created the organization, you're automatically an owner. If someone else created it, ensure you're added as a member with publish permissions.

### 3. Build and Test Before Publishing

```bash
# Build the project (this runs automatically via prepack, but good to verify)
pnpm build

# Run tests to ensure everything works
pnpm test

# Verify the lib directory contains all necessary files
ls -la lib/
```

### 4. Verify Package Contents

The `files` field in `package.json` specifies `/lib` will be published. Verify:

```bash
# See what will be included in the package
npm pack --dry-run
```

This creates a tarball preview showing exactly what files will be published.

### 5. Update Version (if needed)

```bash
# For first release, version is already 1.0.0
# For subsequent releases, use semantic versioning:

npm version patch  # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor  # 1.0.0 -> 1.1.0 (new features)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)

# This automatically updates package.json and creates a git tag
```

### 6. Publish to npm

```bash
# Publish to npm (public by default for scoped packages)
npm publish --access public

# Or if you've configured access in package.json:
npm publish
```

**Note**: Scoped packages (`@rh-ai-quickstart/cli`) are private by default. Use `--access public` to make it publicly installable.

### 7. Verify Publication

```bash
# Check the package on npm
npm view @rh-ai-quickstart/cli

# Or visit in browser
# https://www.npmjs.com/package/@rh-ai-quickstart/cli
```

### 8. Test Installation

```bash
# Test installing globally
npm install -g @rh-ai-quickstart/cli

# Verify the command works
quickstart --version
quickstart --help
```

## Publishing Updates

For subsequent releases:

```bash
# 1. Make your changes
# 2. Update version
npm version patch  # or minor/major

# 3. Build (runs automatically via prepack)
pnpm build

# 4. Test
pnpm test

# 5. Publish
npm publish --access public

# 6. Push git tags (if using version command)
git push --follow-tags
```

## Troubleshooting

### "You do not have permission to publish"
- Ensure you're logged in: `npm whoami`
- Verify you're a member of the `rh-ai-quickstart` organization
- Check organization permissions at https://www.npmjs.com/settings/rh-ai-quickstart/members

### "Package name already exists"
- The package name `@rh-ai-quickstart/cli` might already be taken
- Check: https://www.npmjs.com/package/@rh-ai-quickstart/cli
- If taken, you'll need to use a different name or contact the owner

### "Cannot publish over existing version"
- You're trying to publish the same version twice
- Use `npm version` to bump the version first

### Build fails during prepack
- Ensure TypeScript compiles successfully: `pnpm build`
- Check for TypeScript errors: `pnpm tsc --noEmit`

## Best Practices

1. **Always test before publishing**: Run `pnpm test` and `pnpm build`
2. **Use semantic versioning**: Follow semver.org guidelines
3. **Write changelog**: Document changes in CHANGELOG.md
4. **Tag releases**: Use git tags for releases
5. **Test installation**: Always test installing the published package
6. **Monitor downloads**: Check npm stats after publishing

## CI/CD Publishing (Optional)

For automated publishing, you can set up GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Package.json Configuration Notes

- ✅ `prepack` script automatically builds before publishing
- ✅ `files` field specifies only `/lib` is published (keeps package small)
- ✅ `bin` field defines the `quickstart` command
- ✅ Scoped package name: `@rh-ai-quickstart/cli`

## Next Steps After Publishing

1. Update README with installation instructions
2. Create a GitHub release
3. Share on social media / dev communities
4. Monitor npm stats and issues
5. Gather user feedback

