import React from "react";

import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { FoldVoid } from "@utils/either";
import { NoOp } from "@utils/no-op";
import { tap } from "@utils/functions";

import "@containers/status-bar/index.css";

/**
 * StatusBar is a wrapper component for custom informative views and Notifications.g
 * TODO: Extract Caret Position component to Editor module.
 */
export const StatusBar: React.FC = () => {
	const dispatch = useAppDispatch();

	const { tab } = useCurrentTab();

	const Bell = useIcon("HiOutlineBell");
	const Code = useIcon("HiOutlineCode");

	const handleClick = () => dispatch({ type: "@top-bar/open-go-to-line" });

	return (
		<div className="status-bar">
			<div className="status-bar-side-container">
				{tab && (
					<div className="status-bar-item" onClick={handleClick}>
						<Code />
						<div className="flex space-x-2">
							{tab.caretPositions.map((position, index) => (
								<div
									key={`${position.start.line}-${position.start.character}`}
									title={`The caret is located on character ${position.start.character} of line ${position.start.line}`}
									className=""
								>
									{position.start.line}:{position.start.character}
									{index !== tab.caretPositions.length - 1 ? "," : ""}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="status-bar-side-container">
				<div className="status-bar-item">
					<Bell />
				</div>
			</div>
		</div>
	);
};
