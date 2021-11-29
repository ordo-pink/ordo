import type { MDFile } from "../../../global-context/types"

import React from "react"

const readableSize = (a: number, b = 2, k = 1024): string => {
	const d = Math.floor(Math.log(a) / Math.log(k))
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))} ${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`
}

const Prop: React.FC<{ name: string; value: string }> = ({ name, value }) => (
	<div className="flex justify-between text-sm text-gray-500 leading-7">
		<div className="w-4/12">{name}</div>
		<div className="w-8/12">{value}</div>
	</div>
)

type MetadataProps = {
	metadata: MDFile
}

export const Metadata: React.FC<MetadataProps> = ({ metadata }) => {
	const createdAt = metadata.createdAt.toLocaleString()
	const updatedAt = metadata.updatedAt.toLocaleString()
	const size = readableSize(metadata.size)

	return (
		metadata &&
		metadata.readableName && (
			<div className="flex flex-col w-6/12 mx-auto mt-64 mb-12">
				<div className="text-5xl">{metadata.readableName}</div>
				<details>
					<summary className="text-xs text-gray-500">File Stats</summary>
					<div className="pt-4">
						<Prop name="Created" value={createdAt} />
						<Prop name="Last Updated" value={updatedAt} />
						<Prop name="Size" value={size} />
					</div>
				</details>
			</div>
		)
	)
}
