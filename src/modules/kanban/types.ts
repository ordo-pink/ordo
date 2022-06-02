import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";

export type Column = OrdoFolder & { tasks: string[] };
export type Columns = { [key: string]: Column };
export type Task = OrdoFile;
export type Tasks = { [key: string]: OrdoFile };
export type ColumnOrder = string[];
