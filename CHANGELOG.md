# Change Log

All notable changes to the "test-util" will be documented in this file.

## [Unreleased]

## [0.0.11] - 2023-08-16

### Changed

- Use platform-agnostic join for paths.

## [0.0.10] - 2023-08-16

### Changed

- Update dependencies.
- Update publishing process.
- Format code with `prettier`.

## [0.0.9] - 2023-05-12

### Changed

- **Breaking:** Test functions using will calculate the difference between actual and expected files, and fill in the other list with placeholder files for cleaner diffs.
- `filesToTestString` now accepts an additional `missingFiles` parameter.

## [0.0.8] - 2023-05-11

### Changed

- **Breaking:** Change `runFileComparisonTestBody()` to `getFileSystemTestCaseRuns()` to have `options` parameter.

## [0.0.7] - 2023-05-11

### Changed

- **Breaking:** Rename `fileComparisonTestBody()` to `runFileComparisonTestBody()`.
- **Breaking:** Change input parameters of `filesToTestString()`. It now accepts a single `files: FilesContainer` parameter.

### Added

- Add `getFileSystemTestCaseRuns()` function.

## [0.0.6] - 2023-05-11

### Changed

- Update dependencies.

## [0.0.5] - 2023-05-11

### Changed

- **Breaking:** Rename `findFsTestCaseDirectories` to `findFileSystemTestCaseDirectories`. Similar rename to it's `options` parameter interface name.

## [0.0.4] - 2023-05-11

### Added

- Add `fileComparisonTestBody()` function.

## [0.0.3] - 2023-05-11

### Changed

- **Breaking:** Change return value for `readFakeFiles()` function.

### Added

- Add `findFsTestCaseDirectories()` function.

## [0.0.2] - 2023-05-10

### Changed

- **Breaking:** Update `filesToTestString()` and `readFakeFiles()` functions.

## [0.0.1] - 2023-05-08

### Added

- Add `filesToTestString()` and `readFakeFiles()` functions.
- Add everything else needed for intial release.

<!--
See: https://common-changelog.org/

## [0.0.1] - 2023-01-01

### Changed

### Added

### Removed

### Fixed
-->
