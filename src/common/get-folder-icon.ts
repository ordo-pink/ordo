import { HiChevronRight, HiChevronDown, HiFolder, HiFolderOpen } from "react-icons/hi";
import { IconType } from "react-icons/lib";
import { OrdoFolder } from "../explorer/types";

export const getCollapseIcon = (folder: OrdoFolder): IconType => (folder.collapsed ? HiChevronRight : HiChevronDown);

export const getFolderIcon = (folder: OrdoFolder): IconType => (folder.collapsed ? HiFolder : HiFolderOpen);
