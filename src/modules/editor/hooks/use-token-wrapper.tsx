import React from "react";

import { Node } from "@core/parser/types";
import { BlockNodeType, InlineNodeType } from "@modules/text-parser/enums";
import { useAppDispatch } from "@core/state/store";

export const useTokenWrapper = (token?: Node, isCurrentLine = false) => {
	const dispatch = useAppDispatch();

	const wrapper: React.FC = React.useMemo(() => {
		if (token?.type === BlockNodeType.HEADING) {
			if (token.depth === 1) return ({ children }) => <h1 className="inline text-4xl">{children}</h1>;
			if (token.depth === 2) return ({ children }) => <h2 className="inline text-3xl">{children}</h2>;
			if (token.depth === 3) return ({ children }) => <h3 className="inline text-2xl">{children}</h3>;
			if (token.depth === 4) return ({ children }) => <h4 className="inline text-xl">{children}</h4>;
			return ({ children }) => <h5 className="inline text-lg">{children}</h5>;
		}

		if (token?.type === BlockNodeType.TODO) {
			return ({ children }) =>
				isCurrentLine ? (
					<span>{children}</span>
				) : (
					<div className="flex space-x-2 items-center">
						<input
							type="checkbox"
							className="block w-5 h-5"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onChange={() => dispatch({ type: "@editor/toggle-todo", payload: token.range.start.line - 1 })}
							checked={(token.data! as { checked: boolean }).checked}
						/>
						<div>{children}</div>
					</div>
				);
		}

		if (token?.type === BlockNodeType.HR) {
			return ({ children }) => (isCurrentLine ? <span>{children}</span> : <hr />);
		}

		if (token?.type === InlineNodeType.BOLD) {
			return ({ children }) => <strong className="font-bold">{children}</strong>;
		}

		if (token?.type === InlineNodeType.ITALIC) {
			return ({ children }) => <em className="italic">{children}</em>;
		}

		if (token?.type === InlineNodeType.CODE) {
			return ({ children }) => (
				<code className="px-2 py-0.5 rounded-lg bg-neutral-300 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200">
					{children}
				</code>
			);
		}

		return ({ children }) => <span>{children}</span>;
	}, [token && token.type, token && token.depth, isCurrentLine, token && token.data && (token.data as any).checked]);

	return wrapper;
};
