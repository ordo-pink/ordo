import React from "react";

import { useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumb } from "@modules/editor/components/breadcrumb";
import { NoOp } from "@utils/no-op";

export const Breadcrumbs = React.memo(
	() => {
		const { eitherFile } = useCurrentTab();
		const { separator } = useAppSelector((state) => state.app.internalSettings);

		return eitherFile.fold(NoOp, (f) => (
			<div className="editor_breadcrumbs">
				{f.relativePath.split(separator).map((item, index) => (
					<Breadcrumb key={`${item}-${index}`} pathChunk={item} />
				))}
			</div>
		));
	},
	() => true,
);
