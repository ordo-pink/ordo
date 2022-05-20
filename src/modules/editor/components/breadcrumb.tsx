import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { fromBoolean } from "@utils/either";

type BreadcrumbProps = {
	pathChunk: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = React.memo(
	({ pathChunk }) => {
		const { file } = useCurrentTab();

		const Icon = useFileIcon(file);
		const HiOutlineFolder = useIcon("HiOutlineFolder");
		const HiFolder = useIcon("HiFolder");
		const HiChevronRight = useIcon("HiChevronRight");

		const Folder = () => <HiFolder />;
		const File = () => <Icon />;

		return (
			file && (
				<div className="editor_breadcrumb">
					{fromBoolean(pathChunk === "").fold(
						() => (
							<div className="editor_breadcrumb_title">
								{fromBoolean(pathChunk === file.readableName).fold(Folder, File)}
								<div>{pathChunk}</div>
							</div>
						),
						() => (
							<HiOutlineFolder />
						),
					)}
					{pathChunk !== file.readableName && <HiChevronRight />}
				</div>
			)
		);
	},
	(prev, next) => prev.pathChunk === next.pathChunk,
);
