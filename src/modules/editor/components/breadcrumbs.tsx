import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppSelector } from "@core/state/store";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useIcon } from "@core/hooks/use-icon";
import { Either } from "or-else";
import { NoOp } from "@utils/no-op";

export const Breadcrumbs = React.memo(
	() => {
		const { eitherFile } = useCurrentTab();
		const { separator } = useAppSelector((state) => state.app.internalSettings);

		const Icon = useFileIcon(eitherFile.fold(NoOp, (x) => x));
		const HiOutlineFolder = useIcon("HiOutlineFolder");
		const HiFolder = useIcon("HiFolder");
		const HiChevronRight = useIcon("HiChevronRight");

		return eitherFile.fold(NoOp, (f) => (
			<div className="flex space-x-2 text-sm text-neutral-500 items-center px-4 py-2 select-none">
				{f.relativePath.split(separator).map((item) => (
					<div key={item} className="flex flex-shrink-0 truncate space-x-2 items-center">
						{item === "" ? (
							<HiOutlineFolder className="text-neutral-500" />
						) : (
							<div className="flex items-center space-x-2">
								{item === f.readableName ? <Icon className="text-neutral-500" /> : <HiFolder className="text-neutral-500" />}
								<div>{item}</div>
							</div>
						)}
						{item !== f.readableName && <HiChevronRight className="text-neutral-500" />}
					</div>
				))}
			</div>
		));
	},
	() => true,
);
