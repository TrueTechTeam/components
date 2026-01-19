# UI Components Release Command

This command performs a full release workflow for the `@true-tech-team/react-components` library:
1. Test, lint, and fix any errors
2. Update the CHANGELOG and README
3. Build the project
4. Deploy to npm

## Prerequisites

- Ensure you are logged into npm: `npm login`
- Ensure you have write access to `@true-tech-team/react-components`

## Workflow Steps

### Step 1: Test and Lint

Run the following commands and fix any errors encountered:

```bash
# Run linting with auto-fix
nx lint ui-components --fix

# Run type checking
npx tsc --noEmit -p libs/ui-components/tsconfig.lib.json

# Run all tests
nx test ui-components
```

If any lint errors cannot be auto-fixed, manually fix them before proceeding.
If any tests fail, fix the failing tests before proceeding.
If type checking fails, fix the type errors before proceeding.

### Step 2: Update Documentation

#### CHANGELOG.md

1. Read the current CHANGELOG at `libs/ui-components/CHANGELOG.md`
2. Review git changes since the last release:
   ```bash
   git log --oneline $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~20")..HEAD -- libs/ui-components
   git diff --stat $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~20")..HEAD -- libs/ui-components
   ```
3. Move items from `[Unreleased]` to a new version section
4. Determine the new version number based on semantic versioning:
   - MAJOR: Breaking changes
   - MINOR: New features (backwards compatible)
   - PATCH: Bug fixes (backwards compatible)
5. Add the current date in YYYY-MM-DD format
6. Categorize changes under: Added, Changed, Fixed, Removed, Deprecated, Security

#### README.md

1. Read the current README at `libs/ui-components/README.md`
2. Update any documentation that needs to reflect new features or changes
3. Ensure all new components are documented with usage examples
4. Update the component list if new components were added

#### package.json Version

1. Update the version in `libs/ui-components/package.json` to match the CHANGELOG

### Step 3: Build

```bash
# Clean previous build
rm -rf dist/libs/ui-components

# Build the library
nx build ui-components

# Verify build output exists
ls -la dist/libs/ui-components
```

Verify the build contains:
- `index.js` - CommonJS bundle
- `index.mjs` - ESM bundle
- `index.d.ts` - TypeScript declarations
- Style files (`.css`, `.scss`)

### Step 4: Deploy to npm

```bash
# Navigate to the build output
cd dist/libs/ui-components

# Verify package.json is correct
cat package.json

# Publish to npm (public access for scoped packages)
npm publish --access public
```

If publishing a pre-release:
```bash
npm publish --access public --tag beta
```

### Step 5: Post-Release

After successful publish:

1. Create a git tag for the release:
   ```bash
   git tag -a v<version> -m "Release v<version>"
   git push origin v<version>
   ```

2. Update the comparison links at the bottom of CHANGELOG.md

3. Commit the version bump and changelog updates:
   ```bash
   git add libs/ui-components/package.json libs/ui-components/CHANGELOG.md libs/ui-components/README.md
   git commit -m "chore(ui-components): release v<version>"
   git push
   ```

## Error Handling

### Lint Errors
- Run `nx lint ui-components --fix` first
- If errors persist, manually fix them in the source files
- Common issues: unused imports, missing semicolons, type errors

### Test Failures
- Run `nx test ui-components --verbose` to see detailed errors
- Fix failing tests before proceeding
- Run `nx test ui-components --updateSnapshot` if snapshot updates are needed

### Build Errors
- Clear Nx cache: `nx reset`
- Check for TypeScript errors: `npx tsc --noEmit -p libs/ui-components/tsconfig.lib.json`
- Review vite.config.ts for configuration issues

### npm Publish Errors
- Verify you're logged in: `npm whoami`
- Check package name isn't taken
- Verify version hasn't been published: `npm view @true-tech-team/react-components versions`
- Ensure `publishConfig.access` is set to `"public"` in package.json

## Rollback

If a bad version was published:

```bash
# Unpublish within 72 hours (use with caution)
npm unpublish @true-tech-team/react-components@<version>

# Or deprecate the version
npm deprecate @true-tech-team/react-components@<version> "This version has issues, please use <good-version>"
```
