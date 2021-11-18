import type { MDFile } from "../../../global-context/types"

import React from "react"

import { Emoji } from "../emoji"

const readableSize = (a: number, b = 2, k = 1024): string => {
	const d = Math.floor(Math.log(a) / Math.log(k))
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`
}

export const Metadata: React.FC<{ metadata: MDFile }> = ({ metadata }) => {
	return (
		metadata &&
		metadata.readableName && (
			<div className="flex flex-col w-6/12 mx-auto mt-64 mb-12">
				<div className="text-5xl">{metadata.readableName}</div>
				<details>
					<summary className="text-xs text-gray-500">File Stats</summary>
					<div className="pt-4">
						<div className="flex justify-between text-sm text-gray-500 leading-7">
							<div className="w-4/12">
								{" "}
								<Emoji icon="🕛">Created</Emoji>
							</div>
							<div className="w-8/12">{metadata.createdAt.toLocaleDateString()}</div>
						</div>
						<div className="flex justify-between text-sm text-gray-500 leading-7">
							<div className="w-4/12">
								<Emoji icon="✍️">Last Updated</Emoji>
							</div>
							<div className="w-8/12">{metadata.updatedAt.toLocaleDateString()}</div>
						</div>
						<div className="flex justify-between text-sm text-gray-500 leading-7">
							<div className="w-4/12">
								<Emoji icon="👆">Last Accessed</Emoji>
							</div>
							<div className="w-8/12">{metadata.accessedAt.toLocaleDateString()}</div>
						</div>
						<div className="flex justify-between text-sm text-gray-500 leading-7">
							<div className="w-4/12">
								{" "}
								<Emoji icon="🛣">File Path</Emoji>
							</div>
							<div className="w-8/12">{metadata.path}</div>
						</div>
						<div className="flex justify-between text-sm text-gray-500 leading-7">
							<div className="w-4/12">
								{" "}
								<Emoji icon="🚛">File Size</Emoji>
							</div>
							<div className="w-8/12">{readableSize(metadata.size)}</div>
						</div>
					</div>
				</details>
			</div>
		)
	)
}
