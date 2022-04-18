import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";

export const isFolder = (x: OrdoFile | OrdoFolder): x is OrdoFolder => x.type === "folder";
