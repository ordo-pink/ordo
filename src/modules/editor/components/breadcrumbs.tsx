import React from "react";

import { useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumb } from "@modules/editor/components/breadcrumb";

export const Breadcrumbs = React.memo(
	() => {
		const { file } = useCurrentTab();
		const { separator } = useAppSelector((state) => state.app.internalSettings);

		return file ? (
			<div className="editor_breadcrumbs">
				{file.relativePath.split(separator).map((item, index) => (
					<Breadcrumb key={`${item}-${index}`} pathChunk={item} />
				))}
			</div>
		) : null;
	},
	() => true,
);
