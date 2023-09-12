export type PathMappingFile = readonly PathMappingGroup[];

export interface PathMappingGroup {
  readonly group: string;
  readonly files: readonly PathMappingEntry[];
}

export interface PathMappingEntry {
  readonly fr: string;
  readonly to: string;
}
