import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppDispatch } from "@core/state/store";

export const StatusBar: React.FC = () => {
	const dispatch = useAppDispatch();

	const { tab } = useCurrentTab();

	const Bell = useIcon("HiOutlineBell");
	const Line = useIcon("HiOutlineCode");

	const [line, setLine] = React.useState<number>(0);
	const [character, setCharacter] = React.useState<number>(0);

	React.useEffect(() => {
		if (!tab) return;
		setLine(tab.caretPositions[0].start.line + 1);
		setCharacter(tab.caretPositions[0].start.character);
	}, [tab]);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center text-xs">
				<div
					className="flex items-center space-x-1 hover:bg-gray-300 dark:hover:bg-gray-600 py-0.5 px-4 font-mono cursor-pointer"
					onClick={() => dispatch({ type: "@top-bar/open-go-to-line" })}
					title={`The caret is located on character ${character} of line ${line}`}
				>
					<Line />
					<span>
						Ln {line}, Col {character}
					</span>
				</div>
			</div>

			<div className="py-1 px-4 cursor-pointer">
				<Bell />
			</div>
		</div>
	);
};
