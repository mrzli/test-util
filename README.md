# Test Utilities

Some test utilities.

## Installation

```bash
npm install --save-dev @gmjs/test-util
```

## Functions

- `readFakeFiles(directory: string, options?: ReadFakeFilesOptions): Promise<readonly FilePathContentAny[]>`
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
      - Description
        - Options for reading fake files.
        - Optional parameter
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

- `filesToTestString(files: readonly FilePathContentAny[]): string`
  - Description
    - Converts a list of path-content pairs to a string that can be used for comparison in tests.
    - For binary files, only a literal token `<binary>` and a hash are output for content.
    - Files are sorted by path, alphabetically, ascending.
    - The produced format is as follows:
      ```
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
