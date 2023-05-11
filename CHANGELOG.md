# Change Log

All notable changes to the "test-util" will be documented in this file.

## [Unreleased]

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
