# Publishing Guide for @alphabite/speedy-sdk

This guide explains how to publish the Speedy SDK to npm.

## Pre-Publishing Checklist

Before publishing, ensure all these items are complete:

- [x] Package name set to `@alphabite/speedy-sdk`
- [x] Version number updated in `package.json`
- [x] Comprehensive README.md created
- [x] LICENSE file added (MIT)
- [x] .npmignore file configured
- [x] All tests passing (69/69 ✅)
- [x] TypeScript builds successfully
- [x] Dependencies properly listed
- [x] Repository URLs configured

## Publishing Steps

### 1. First-Time Setup (One-time only)

If you haven't published to npm before:

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

For scoped packages (@alphabite/speedy-sdk), ensure you have access to the `@alphabite` organization on npm.

### 2. Pre-Publish Verification

```bash
# Run type checking
npm run typecheck

# Build the package
npm run build

# Run all tests (optional, but recommended)
npm test

# Or run just integration tests
npm run test:integration
```

### 3. Test the Package Locally

Before publishing, test the package locally:

```bash
# Create a tarball
npm pack

# This creates a file like: alphabite-speedy-sdk-1.0.0.tgz
# Install it in another project to test:
cd /path/to/test-project
npm install /path/to/speedy/alphabite-speedy-sdk-1.0.0.tgz
```

### 4. Publish to npm

```bash
# Dry run to see what will be published
npm publish --dry-run

# Publish to npm (for scoped packages, make it public)
npm publish --access public
```

### 5. Verify Publication

```bash
# Check if package is available
npm view @alphabite/speedy-sdk

# Install in a test project
npm install @alphabite/speedy-sdk
```

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

### Updating Version

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major
```

These commands automatically:

1. Update package.json version
2. Create a git commit
3. Create a git tag

Then publish:

```bash
npm publish --access public
```

## What Gets Published

The npm package will include:

```
@alphabite/speedy-sdk/
├── dist/                 # Compiled JavaScript + TypeScript definitions
│   ├── index.js
│   ├── index.d.ts
│   ├── client.js
│   ├── client.d.ts
│   ├── resources/
│   ├── types/
│   └── utils/
├── README.md            # Usage documentation
├── LICENSE              # MIT License
└── package.json         # Package metadata
```

**NOT included** (filtered by .npmignore):

- Source TypeScript files (`src/`)
- Tests (`tests/`)
- Development configs
- Example code
- Documentation files

## Package Size

Check package size before publishing:

```bash
# See package contents and size
npm pack --dry-run

# Check actual tarball size
npm pack
ls -lh alphabite-speedy-sdk-1.0.0.tgz
```

Aim to keep the package under 1MB for better install times.

## Publishing Checklist

Before running `npm publish`:

1. ✅ All tests pass: `npm test`
2. ✅ Build succeeds: `npm run build`
3. ✅ Types check: `npm run typecheck`
4. ✅ README is up-to-date
5. ✅ Version number is correct
6. ✅ CHANGELOG updated (if applicable)
7. ✅ No sensitive data in package
8. ✅ Dry run looks good: `npm publish --dry-run`

## Continuous Integration

For automated publishing, consider setting up GitHub Actions:

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
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Error: 403 Forbidden

- Ensure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`
- Verify you have permission to publish under @alphabite scope

### Error: Version already exists

- You cannot republish the same version
- Update version number: `npm version patch`

### Error: Package name already taken

- The package name `@alphabite/speedy-sdk` must be available
- Scoped packages require organization access

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Post-Publishing

After successful publication:

1. **Tag the release in Git**:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create GitHub Release**:

   - Go to repository → Releases → New Release
   - Choose the tag you just created
   - Add release notes
   - Attach any relevant files

3. **Update Documentation**:

   - Ensure README badges work
   - Test installation instructions
   - Update any external documentation

4. **Announce**:
   - Tweet about the release
   - Post in relevant communities
   - Update project website

## Unpublishing

**Warning**: Unpublishing is discouraged and has restrictions.

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @alphabite/speedy-sdk@1.0.0

# Unpublish entire package (use with extreme caution)
npm unpublish @alphabite/speedy-sdk --force
```

## Support

For publishing issues:

- npm support: https://www.npmjs.com/support
- npm docs: https://docs.npmjs.com/

---

## Quick Reference

```bash
# Complete publishing workflow
npm run typecheck        # Check types
npm run build           # Build package
npm test                # Run tests
npm publish --dry-run   # Preview what will be published
npm publish --access public  # Publish to npm

# Update and republish
npm version patch       # Bump version
npm publish --access public  # Publish new version
```

---

**Ready to publish!** 🚀

The @alphabite/speedy-sdk package is fully prepared and ready for npm publication.
