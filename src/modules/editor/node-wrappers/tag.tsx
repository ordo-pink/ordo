import React from "react";

import { TagNode } from "@modules/text-parser/types";

type Config = {
	node: TagNode;
};

export const TagWrapper =
	({ node }: Config): React.FC =>
	({ children }) =>
		<strong className="dark:text-purple-400 text-pink-700 drop-shadow-xl mt-2">{children}</strong>;
