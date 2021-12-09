import type { OrdoFileWithBody } from "../../../file-tree/types";

import React from "react";

import { Conditional } from "../../../common/components/conditional";
import { isEmbeddableComponent, renderEmbeddable } from "./render-embeddable";
import { applyLineStyling } from "./apply-line-styling";

export const isEmbeddableContent = (line: string): boolean => /^!\[\[(.*)\]\]/.test(line);

export const EmbeddableContent: React.FC<{ line: string; currentContent: string }> = ({
	line,
	currentContent,
}) => {
	const strippedContent = line.replace(/^!\[\[/, "").replace(/\]\]$/, "");

	const [node, setNode] = React.useState<OrdoFileWithBody>(null);
	const [hash, setHash] = React.useState("");

	const isUrl = strippedContent.startsWith("http://") || strippedContent.startsWith("https://");

	React.useEffect(() => {
		// window.fileSystemAPI.findFileBySubPath(strippedContent.concat(".md")).then((n) => {
		// 	if (!n) {
		// 		const n = {
		// 			body: "<div class='text-red-600 text-center uppercase font-bold'>You are trying to embed a page that doesn't exist</div>",
		// 			path: strippedContent.concat(".md"),
		// 		};
		// 		setNode(n as any);
		// 		setHash("booo");
		// 	} else {
		// 		if (n.body === currentContent) {
		// 			n.body =
		// 				"<div class='text-red-600 text-center uppercase font-bold'>Recursion is generally a bad idea</div>";
		// 		}
		// 		setNode(n);
		// 		setHash(n.path);
		// 	}
		// });
	}, [hash]);

	return (
		<Conditional when={node && !isUrl}>
			<div className="p-8 bg-gray-100 border border-gray-300 rounded-lg">
				{node &&
					node.body.split("\n").map((l, i) => (
						<div key={`${l}-${i}`}>
							<div>{applyLineStyling(l)}</div>

							<Conditional when={isEmbeddableContent(l)}>
								<div className="p-2">
									<EmbeddableContent currentContent={currentContent} line={l} />
								</div>
							</Conditional>

							<Conditional when={isEmbeddableComponent(l)}>
								<div className="p-2">{renderEmbeddable(l)}</div>
							</Conditional>
						</div>
					))}
			</div>
			<Conditional when={isUrl}>
				<div className="text-red-600 text-center uppercase font-bold">
					Embedding websites is not supported
				</div>
			</Conditional>
		</Conditional>
	);
};
