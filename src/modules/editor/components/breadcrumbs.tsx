import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppSelector } from "@core/state/store";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useIcon } from "@core/hooks/use-icon";

export const Breadcrumbs = React.memo(
	() => {
		const { file } = useCurrentTab();
		const { separator } = useAppSelector((state) => state.app.internalSettings);

		const Icon = useFileIcon(file);
		const HiOutlineFolder = useIcon("HiOutlineFolder");
		const HiFolder = useIcon("HiFolder");
		const HiChevronRight = useIcon("HiChevronRight");

		return (
			file && (
				<div className="flex space-x-2 text-sm text-neutral-500 items-center px-4 py-2 select-none">
					{file.relativePath.split(separator).map((item) => (
						<div key={item} className="flex flex-shrink-0 truncate space-x-2 items-center">
							{item === "" ? (
								<HiOutlineFolder className="text-neutral-500" />
							) : (
								<div className="flex items-center space-x-2">
									{item === file.readableName ? (
										<Icon className="text-neutral-500" />
									) : (
										<HiFolder className="text-neutral-500" />
									)}
									<div>{item}</div>
								</div>
							)}
							{item !== file.readableName && <HiChevronRight className="text-neutral-500" />}
						</div>
					))}
				</div>
			)
		);
	},
	() => true,
);
