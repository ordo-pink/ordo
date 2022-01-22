import React from "react"
import { getFileIcon } from "../../application/get-file-icon"
import { OrdoFile } from "../../application/types"

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const Icon = file && getFileIcon(file)

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 12 + "px" }}
			className={`flex space-x-2 items-center`}
			onClick={() => {
				window.ordo.emit("@application/open-file", file.path)
			}}
		>
			<Icon className="shrink-0 text-gray-500" />
			<div className="pr-2 truncate text-gray-700 py-0.5">{file.readableName}</div>
		</div>
	)
}
