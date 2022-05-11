import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppSelector } from "@core/state/store";
import { NoOp } from "@utils/no-op";
import { Breadcrumb } from "./breadcrumb";

export const Breadcrumbs = React.memo(
	() => {
		const { eitherFile } = useCurrentTab();
		const { separator } = useAppSelector((state) => state.app.internalSettings);

		return eitherFile.fold(NoOp, (f) => (
			<div className="editor_breadcrumbs">
				{f.relativePath.split(separator).map((item) => (
					<Breadcrumb pathChunk={item} />
				))}
			</div>
		));
	},
	() => true,
);
