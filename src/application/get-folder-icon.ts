import {
	HiFolder,
	HiFolderOpen,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineFolder,
	HiOutlineFolderOpen,
} from "react-icons/hi"
import { OrdoFolder } from "./types"

export const getCollapseIcon = (folder: OrdoFolder) => (folder.collapsed ? HiOutlineChevronRight : HiOutlineChevronDown)
export const getFolderIcon = (folder: OrdoFolder) =>
	folder.collapsed
		? folder.children.length
			? HiFolder
			: HiOutlineFolder
		: folder.children.length
		? HiFolderOpen
		: HiOutlineFolderOpen
