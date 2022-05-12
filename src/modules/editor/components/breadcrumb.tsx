import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { NoOp } from "@utils/no-op";
import { fromBoolean } from "@utils/either";
import { id } from "@utils/functions";

type BreadcrumbProps = {
	pathChunk: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ pathChunk }) => {
	const { eitherFile } = useCurrentTab();

	const Icon = useFileIcon(eitherFile.fold(NoOp, id));
	const HiOutlineFolder = useIcon("HiOutlineFolder");
	const HiFolder = useIcon("HiFolder");
	const HiChevronRight = useIcon("HiChevronRight");

	const Folder = () => <HiFolder />;
	const File = () => <Icon />;

	return eitherFile.fold(NoOp, (f) => (
		<div className="editor_breadcrumb">
			{fromBoolean(pathChunk === "").fold(
				() => (
					<div className="editor_breadcrumb_title">
						{fromBoolean(pathChunk === f.readableName).fold(Folder, File)}
						<div>{pathChunk}</div>
					</div>
				),
				() => (
					<HiOutlineFolder />
				),
			)}
			{pathChunk !== f.readableName && <HiChevronRight />}
		</div>
	));
};
