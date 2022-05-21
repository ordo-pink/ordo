import React from "react";

import { Node } from "@core/parser/types";
import { BlockNodeType, InlineNodeType } from "@modules/text-parser/enums";

export const useTokenWrapper = (token?: Node) => {
	const wrapper: React.FC = React.useMemo(() => {
		if (token?.type === BlockNodeType.HEADING) {
			if (token.depth === 1) return ({ children }) => <h1 className="inline text-4xl">{children}</h1>;
			if (token.depth === 2) return ({ children }) => <h2 className="inline text-3xl">{children}</h2>;
			if (token.depth === 3) return ({ children }) => <h3 className="inline text-2xl">{children}</h3>;
			if (token.depth === 4) return ({ children }) => <h4 className="inline text-xl">{children}</h4>;
			return ({ children }) => <h5 className="inline text-lg">{children}</h5>;
		}

		if (token?.type === BlockNodeType.BLOCKQUOTE) {
			return ({ children }) => (
				<blockquote className="inline bg-neutral-200 rounded-lg px-2 py-0.5">{children}</blockquote>
			);
		}

		if (token?.type === InlineNodeType.BOLD) {
			return ({ children }) => <strong className="font-bold">{children}</strong>;
		}

		if (token?.type === InlineNodeType.ITALIC) {
			return ({ children }) => <em className="italic">{children}</em>;
		}

		if (token?.type === InlineNodeType.CODE) {
			return ({ children }) => <code className="px-1 py-0.5 rounded-lg bg-rose-200 text-rose-700">{children}</code>;
		}

		return ({ children }) => <span>{children}</span>;
	}, [token && token.type, token && token.depth]);

	return wrapper;
};
