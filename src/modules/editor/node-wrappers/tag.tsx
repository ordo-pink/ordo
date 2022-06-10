import React from "react";

import { TagNode } from "@modules/text-parser/types";

type Config = {
	node: TagNode;
};

export const TagWrapper =
	({ node }: Config): React.FC =>
	({ children }) =>
		(
			<strong className="bg-gradient-to-tr from-orange-600 dark:from-purple-400 to-pink-700 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-xl mt-2">
				{children}
			</strong>
		);
