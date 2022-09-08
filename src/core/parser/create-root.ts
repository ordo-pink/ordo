import { DocumentRoot } from "@core/parser/types";

/**
 * Create document root for a file under the given path.
 */
export const createRoot = (path: string): DocumentRoot => ({
  type: "root",
  children: [],
  openingChars: [],
  closingChars: [],
  data: {
    path,
    frontmatter: {},
    length: 0,
  },
  raw: "",
  id: "1",
  depth: 0,
  range: {
    start: {
      line: 1,
      character: 1,
      offset: 1,
    },
    end: {
      line: 1,
      character: 1,
      offset: 1,
    },
  },
});
