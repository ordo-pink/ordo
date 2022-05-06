import React from "react";
import { HiOutlineFolder, HiFolder, HiChevronRight } from "react-icons/hi";

import { getFileIcon } from "@modules/file-explorer/utils/get-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppSelector } from "@core/state/store";

export const Breadcrumbs = React.memo(
	() => {
		const { file } = useCurrentTab();
		const separator = useAppSelector((state) => state.app.internalSettings.separator);

		if (!file) return null;

		const Icon = getFileIcon(file);

		return (
			<div className="flex space-x-2 text-sm text-neutral-500 items-center px-4 py-2 select-none">
				{file.relativePath.split(separator).map((item) => (
					<div key={item} className="flex flex-shrink-0 truncate space-x-2 items-center">
						{item === "" ? (
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
	},
	() => true,
);
