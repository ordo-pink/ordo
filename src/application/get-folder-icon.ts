import {
	HiFolder,
	HiFolderOpen,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineFolder,
	HiOutlineFolderOpen,
} from "react-icons/hi"
import { IconType } from "react-icons/lib"
import { OrdoFolder } from "./types"

export const getCollapseIcon = (folder: OrdoFolder): IconType =>
	folder.collapsed ? HiOutlineChevronRight : HiOutlineChevronDown

export const getFolderIcon = (folder: OrdoFolder): IconType =>
	folder.collapsed
		? folder.children.length
			? HiFolder
			: HiOutlineFolder
		: folder.children.length
		? HiFolderOpen
		: HiOutlineFolderOpen
