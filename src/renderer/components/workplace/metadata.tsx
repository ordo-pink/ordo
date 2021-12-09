import React from "react";

import { MetadataProperty } from "./metadata-property";

type MetadataProps = {
	file: any;
};

export const Metadata: React.FC<MetadataProps> = ({ file }) => {
	const createdAt = file.createdAt.toLocaleString();
	const updatedAt = file.updatedAt.toLocaleString();

	return (
		file &&
		file.readableName && (
			<div className="flex flex-col w-6/12 mx-auto mt-64 mb-12">
				<div className="text-5xl">{file.readableName}</div>
				<details>
					<summary className="text-xs text-gray-500">File Stats</summary>
					<div className="pt-4">
						<MetadataProperty name="Created" value={createdAt} />
						<MetadataProperty name="Last Updated" value={updatedAt} />
						<MetadataProperty name="Size" value={file.readableSize} />
					</div>
				</details>
			</div>
		)
	);
};
