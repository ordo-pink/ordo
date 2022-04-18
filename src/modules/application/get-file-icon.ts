import { HiOutlineDocument, HiOutlineDocumentSearch, HiOutlineDocumentText, HiOutlinePhotograph } from "react-icons/hi";
import { IconType } from "react-icons/lib";

import { OrdoFile } from "@modules/application/types";

export const getFileIcon = (file: OrdoFile): IconType =>
	file.type === "image"
		? HiOutlinePhotograph
		: file.type === "text"
		? file.size
			? HiOutlineDocumentText
			: HiOutlineDocument
		: HiOutlineDocumentSearch;
