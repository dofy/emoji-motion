# Release checklist

Use this checklist before publishing each version. A version is not reserved until publication succeeds.

1. Check `npm view @dofy/native-emoji-motion` and `npm whoami` to confirm name availability and the intended publisher. Check the MIT license and release version.
2. Run `npm test`, `npm run test:types`, `npm run build:demo`, and `npm pack --dry-run`. Review the package contents and test the tarball in a clean ESM consumer, including TypeScript declarations.
3. Check the demo on supported browsers and platforms, including Windows, Linux and mobile. Native emoji shapes and support differ by installed font and OS.
4. Confirm changes are committed, CI passes, and the release commit matches the intended source. Review release notes and verify the package metadata points to the correct public repository.
5. After an explicit decision to publish, authenticate to npm and use `npm publish --access public`. Verify package version, tarball, links and a clean install from the registry.

Do not commit credentials or include generated demo assets, deployment configuration, tests, or local files in the npm tarball.
