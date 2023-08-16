# Test Utilities

Some test utilities.

## Installation

```bash
npm install --save-dev @gmjs/test-util
```

## Functions

- `readFakeFiles(directory: string, options?: ReadFakeFilesOptions): Promise<FilesContainer>`
  - Description
    - Read `<directory>/path-mapping.json`. `path-mapping.json` contains a list of `testFile`-`path` entries.
    - For each entry in `path-mapping.json`, produce a path-content pair, where the path is specified by `path` and the content is the content of the file specified by `testFile`.
    - All files specified by `testFile` must have a `.txt` or `.bin` extension, which determines whether the file is read as text or binary.
    - All files specified by `testFile` are relative to `<directory>/files`.
    - You can refer to files outside of `<directory>/files` using `..` navigation in `testFile`.
    - You can use a special token `<shared>` in `testFile` to refer to files in a shared directory (see `sharedDirectoryRelativePath` in `options` parameter).
  - Parameters
    - `directory: string`
      - Description
        - The directory specifying the fake file system.
        - It should have the following structure.
          ```
          <directory>
            files
              file-1.txt
              file-2.txt
              file-3.bin
            path-mapping.json
          ```
        - Note that you don't need subdirectories because you can use `path-mapping.json` to represent any path in the result (including file name). If you need subdirectories anyway, they are supported, just use proper `testFile`s in `path-mapping.json`.
    - `options: ReadFakeFilesOptions`
      - Description - Options for reading fake files.
      - Fields
        - `sharedDirectoryRelativePath: string`
          - Description
            - Path, relative from `<directory>/files` to a directory with shared files (to be used by `testFile`s in `path-mapping.json`). To access files in this directory, use `<shared>` token in `testFile`.
            - Example (`path-mapping.json`):
              ```json
              [
                {
                  "testFile": "<shared>/shared-file.ts.txt",
                  "path": "Shared file content."
                }
              ]
              ```
              In the above example, `<shared>` will simply be replaced with whatever is present in `sharedDirectoryRelativePath`
          - Default - `'.'`

---

- ```
  function filesToTestString(
    files: FilesContainer,
    missingFiles?: readonly string[],
  ): string
  ```
  - Description
    - Converts a list of path-content pairs to a string that can be used for comparison in tests.
    - For binary files, only a literal token `<binary>` and a hash are output for content.
    - Text and binary file lists are joined, then sorted by path, alphabetically, ascending.
    - `missingFiles` parameter accepts a list of paths to files that are 'missing' from `files`.
    - Such missing files are output with content `<MISSING_FILE>`.
    - Missing files are used for cleaner diffs in tests, when comparing to other lists (which contain the files 'missing' here).
    - The produced format is as follows:
      ```
      --------------------
      Path: a-missing-files.ts
      --------------------
      <MISSING_FILE>
      --------------------
      --------------------
      Path: file-1.ts
      --------------------
      export const SOME_VARIABLE = 'some value';
      --------------------
      --------------------
      Path: some-dir/file-2.ts
      --------------------
      export const SOME_OTHER_VARIABLE = 'some other value';
      --------------------
      Path: this-is-a-binary-file.png
      --------------------
      <binary> 1234567890abcdef
      --------------------
      ```

---

- `findFileSystemTestCaseDirectories(files: FilesContainer): readonly string[]`
  - Description
    - In `rootDirectory`, find all direct descendent directories, which represent test cases.
    - Directories are filtered by `options.testCaseRegex`.
  - Parameters
    - `rootDirectory: string` - Root directory to search for test case directories.
    - `options?: FindFsTestCaseDirectoriesOptions`
      - Description - Options for finding test case directories.
      - Fields
        - `testCaseRegex: RegExp`
          - Description - Regular expression to filter test case directories.
          - Default - `/^example-/`

---

- ```
  runFileComparisonTestBody(
    testCasesParentDirectory: string,
    exampleName: string,
    actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
    options?: RunFileComparisonTestBodyOptions
  ): Promise<TestComparisonStrings>
  ```

  - Description
    - Helper function, used to create test body for file comparison tests.
  - Parameters
    - `testCasesParentDirectory: string` - Root directory with test cases.
    - `exampleName: string` - Name of the single test case directory currently being tested.
    - `actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>`
      - Description
        - Function that takes the full path to test case, and returns the files generated by the code under test.
        - These are the `actual` files produced, and when converted to a string inside `fileComparisonTestBody()`, the are the `actual` part of the test (`expect`) equality check, which are compared to `expected`.
    - `options?: RunFileComparisonTestBodyOptions`
      - Description - Options for running file comparison test body.
      - Fields
      - `sharedDirectoryRelativePath: string` - Same as in `readFakeFiles()`.
  - Examples

    ```ts
    describe('test', () => {
      const testAssetsDirectory = join(__dirname, 'test-assets');
      const TEST_CASES = findFsTestCaseDirectories(testAssetsDirectory);

      for (const example of TEST_CASES) {
        it(example, async () => {
          const { expected, actual } = await runFileComparisonTestBody(
            testAssetsDirectory,
            example,
            getActualFiles,
            // relative to `<testAssetsDirectory>/<test-case>/expected/files`
            // in this case resolves to `<testAssetsDirectory>/shared/files`
            { sharedDirectoryRelativePath: '../../../shared/files' },
          );

          expect(actual).toBe(expected);
        });
      }
    });
    ```

---

- ```
  getFileSystemTestCaseRuns(
    testCasesParentDirectory: string,
    actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>,
    options?: FileSystemTestCaseRunsOptions,
  ): readonly TestCaseRun[]
  ```

  - Description
    - Helper function, used to create test `run()` functions to be used in tests.
    - In a way, this kind of an 'array' version of `runFileComparisonTestBody()` function.
    - This function does not execute tests, nor does it execute the code under test. To actually execute code under test, the `run()` function returned here should be called.
  - Parameters
    - `testCasesParentDirectory: string` - Same as in `runFileComparisonTestBody()`.
    - `actualFunction: (testCaseDirectory: string) => Promise<FilesContainer>` - Same as in `runFileComparisonTestBody()`.
    - `options?: FileSystemTestCaseRunsOptions`
      - Description - Options for creating test case runs.
      - Fields
        - `sharedDirectoryRelativePath: string` - Same as in `readFakeFiles()`.
        - `testCaseRegex: RegExp` - Same as in `findFileSystemTestCaseDirectories()`.
  - Examples

    ```ts
    describe('test', () => {
      const testCasesParentDirectory = join(__dirname, 'test-assets');
      const testCaseRuns = getFileSystemTestCaseRuns(testCasesParentDirectory, getActualFiles, {
        sharedDirectoryRelativePath: '../../..shared/files',
        // testCaseRegex: /^example-/, // this is the default, so it does not need to be specified
      });

      for (const testCaseRun of testCaseRuns) {
        it(testCaseRun.name, async () => {
          const { expected, actual } = await testCaseRun.run();
          expect(actual).toBe(expected);
        });
      }
    });
    ```
