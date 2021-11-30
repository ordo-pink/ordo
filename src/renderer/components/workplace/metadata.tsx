import type { MDFile } from "../../../global-context/types"

import React from "react"

import { MetadataProperty } from "./metadata-property"

type MetadataProps = {
	metadata: MDFile
}

export const Metadata: React.FC<MetadataProps> = ({ metadata }) => {
	const createdAt = metadata.createdAt.toLocaleString()
	const updatedAt = metadata.updatedAt.toLocaleString()

	return (
		metadata &&
		metadata.readableName && (
			<div className="flex flex-col w-6/12 mx-auto mt-64 mb-12">
				<div className="text-5xl">{metadata.readableName}</div>
				<details>
					<summary className="text-xs text-gray-500">File Stats</summary>
					<div className="pt-4">
						<MetadataProperty name="Created" value={createdAt} />
						<MetadataProperty name="Last Updated" value={updatedAt} />
						<MetadataProperty name="Size" value={metadata.readableSize} />
					</div>
				</details>
			</div>
		)
	)
}
