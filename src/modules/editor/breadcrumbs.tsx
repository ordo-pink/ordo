import React from "react";
import { HiOutlineFolder, HiFolder, HiChevronRight } from "react-icons/hi";

import { getFileIcon } from "@utils/get-icon";
import { useCurrentTab } from "./hooks";

export const Breadcrumbs: React.FC = () => {
	const { file } = useCurrentTab();

	if (!file) return null;

	const Icon = getFileIcon(file);

	return (
		<div className="flex space-x-2 items-center px-4 py-2 select-none">
			{file.relativePath.split("/").map((item) => (
				<div key={item} className="flex space-x-2 items-center">
					{item === "." ? (
						<HiOutlineFolder className="text-gray-500" />
					) : (
						<div className="flex items-center space-x-2">
							{item === file.readableName ? <Icon className="text-gray-500" /> : <HiFolder className="text-gray-500" />}
							<div>{item}</div>
						</div>
					)}
					{item !== file.readableName && <HiChevronRight className="text-gray-500" />}
				</div>
			))}
		</div>
	);
};
