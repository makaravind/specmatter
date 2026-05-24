export interface SpecFrontmatter {
  title?: string;
  owner?: string;
  version?: string;
  status?: string;
  jiraid?: string;
  [key: string]: unknown;
}

export interface SpecEntry {
  path: string;
  frontmatter: SpecFrontmatter;
  content: string;
  stats: {
    size: number;
    modified: string;
  };
}

export interface SpecIndex {
  version: 1;
  generatedAt: string;
  root: string;
  count: number;
  entries: SpecEntry[];
}
