import { Switch } from "or-else";

import { useIcon } from "@core/hooks/use-icon";
import { OrdoFile } from "@modules/file-explorer/types";
import { SupportedIcon } from "@core/types";

export const useFileIcon = (file?: OrdoFile | null) => {
	if (!file) {
		return () => null;
	}

	const getIcon: () => SupportedIcon = Switch.of(file.type)
		.case("image", () => "HiOutlinePhotograph" as const)
		.case("document", () => (file.size > 0 ? ("HiOutlineDocumentText" as const) : ("HiOutlineDocument" as const)))
		.default(() => "HiOutlineDocumentSearch");

	const Icon = useIcon(getIcon());

	return Icon;
};
