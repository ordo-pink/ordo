import { getFileIcon } from "@modules/file-explorer/utils/get-icon";
import React from "react";
import { HiOutlineFolder, HiFolder, HiChevronRight } from "react-icons/hi";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const Breadcrumbs: React.FC = () => {
	const { file } = useCurrentTab();

	if (!file) return null;

	const Icon = getFileIcon(file);

	return (
		<div className="flex space-x-2 text-sm text-neutral-500 items-center px-4 py-2 select-none">
			{file.relativePath.split("/").map((item) => (
				<div key={item} className="flex space-x-2 items-center">
					{item === "." ? (
						<HiOutlineFolder className="text-neutral-500" />
					) : (
						<div className="flex items-center space-x-2">
							{item === file.readableName ? <Icon className="text-neutral-500" /> : <HiFolder className="text-neutral-500" />}
							<div>{item}</div>
						</div>
					)}
					{item !== file.readableName && <HiChevronRight className="text-neutral-500" />}
				</div>
			))}
		</div>
	);
};
