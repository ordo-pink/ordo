import { OrdoFileWithBody } from "../file-tree/types";

export type Nullable<T> = T | null;

export interface OrdoEditor {
	tabs: OrdoFileWithBody[];
	currentTab: OrdoFileWithBody;
}
