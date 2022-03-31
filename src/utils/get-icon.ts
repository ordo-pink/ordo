import { OrdoFile, OrdoFolder } from "@modules/editor/editor-slice";
import { IconType } from "react-icons";
import {
	HiOutlineDocument,
	HiOutlineDocumentSearch,
	HiOutlineDocumentText,
	HiOutlinePhotograph,
	HiFolder,
	HiFolderOpen,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineFolder,
	HiOutlineFolderOpen,
} from "react-icons/hi";

export const getFileIcon = (file: OrdoFile): IconType =>
	file.type === "image"
		? HiOutlinePhotograph
		: file.type === "document"
		? file.size
			? HiOutlineDocumentText
			: HiOutlineDocument
		: HiOutlineDocumentSearch;

import {} from "react-icons/hi";

export const getCollapseIcon = (folder: OrdoFolder): IconType =>
	folder.collapsed ? HiOutlineChevronRight : HiOutlineChevronDown;

export const getFolderIcon = (folder: OrdoFolder): IconType =>
	folder.collapsed
		? folder.children.length
			? HiFolder
			: HiOutlineFolder
		: folder.children.length
		? HiFolderOpen
		: HiOutlineFolderOpen;
