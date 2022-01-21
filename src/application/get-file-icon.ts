import { HiDocument, HiDocumentSearch, HiDocumentText, HiPhotograph } from "react-icons/hi"
import { IconType } from "react-icons/lib"
import { OrdoFile } from "./types"

export const getFileIcon = (file: OrdoFile): IconType =>
	file.type === "image"
		? HiPhotograph
		: file.type === "text"
		? file.size
			? HiDocumentText
			: HiDocument
		: HiDocumentSearch
