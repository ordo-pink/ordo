import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useAppDispatch } from "@core/state/store";

import "@containers/status-bar/index.css";
import { tap } from "@utils/tap";
import { FoldVoid } from "@utils/either";

export const StatusBar: React.FC = () => {
	const dispatch = useAppDispatch();

	const { eitherTab } = useCurrentTab();

	const Bell = useIcon("HiOutlineBell");
	const Code = useIcon("HiOutlineCode");

	const [line, setLine] = React.useState<number>(0);
	const [character, setCharacter] = React.useState<number>(0);

	React.useEffect(
		() =>
			eitherTab
				.map(tap((t) => setLine(t.caretPositions[0].start.line + 1)))
				.map(tap((t) => setCharacter(t.caretPositions[0].start.character)))
				.fold(...FoldVoid),
		[eitherTab],
	);

	const handleClick = () => dispatch({ type: "@top-bar/open-go-to-line" });

	return (
		<div className="status-bar">
			<div className="status-bar-side-container">
				<div
					className="status-bar-item"
					onClick={handleClick}
					title={`The caret is located on character ${character} of line ${line}`}
				>
					<Code />
					<span>
						Ln {line}, Col {character}
					</span>
				</div>
			</div>

			<div className="status-bar-side-container">
				<div className="status-bar-item">
					<Bell />
				</div>
			</div>
		</div>
	);
};
