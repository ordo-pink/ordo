import { fromBoolean } from "@utils/either";

/**
 * Get the name of the document without .md if it is present.
 */
export const getDocumentName = (name: string = "") =>
  fromBoolean(name.endsWith(".md")).fold(
    () => name,
    () => name.slice(0, -3),
  );
