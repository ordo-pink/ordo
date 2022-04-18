import { OrdoFile, OrdoFolder } from "@modules/editor/editor-slice";
import { findOrdoFileBy } from "./find-ordo-file-by";

export const findOrdoFile = (tree: OrdoFolder, path: string): OrdoFile | null => findOrdoFileBy(tree, "path", path);
