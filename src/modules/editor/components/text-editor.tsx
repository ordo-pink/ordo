import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { LineNumber } from "./line-number";

export const TextEditor: React.FC = () => {
	const { tab } = useCurrentTab();

	return (
		tab && (
			<>
				<Breadcrumbs />
				<Scrollbars>
					<div className="outline-none" contentEditable={true} suppressContentEditableWarning={true}>
						{tab.raw?.split("\n").map((line, index) => (
							<div key={`${line}-${index}`} className="flex items-center whitespace-nowrap">
								<LineNumber number={index + 1} />
								<div className="px-2">{line ? <div>{line}</div> : <br />}</div>
							</div>
						))}
					</div>
				</Scrollbars>
			</>
		)
	);
};
