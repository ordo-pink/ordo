import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { OrdoFile } from "@modules/file-explorer/types";

export const useFileIcon = (file?: OrdoFile | null) => {
	const iconName = React.useMemo(() => {
		if (!file) return;
		if (file.type === "image") return "HiOutlinePhotograph";
		if (file.size > 0) return "HiOutlineDocumentText";
		else return "HiOutlineDocument";
	}, [file, file && file.path, file && file.type, file && file.size]);

	const Icon = useIcon(iconName);

	return Icon;
};
