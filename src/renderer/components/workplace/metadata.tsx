import type { MDFile } from "../../../global-context/types"

import React from "react"

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
	const size = metadata.size

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
						<Prop name="Size" value={String(size)} />
					</div>
				</details>
			</div>
		)
	)
}
