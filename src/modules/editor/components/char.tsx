import React from "react";

import { Symbol } from "@modules/md-parser/types";
import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";
import { useCurrentPositions } from "@modules/editor/hooks/use-current-positions";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";

type CharProps = {
	char: string;
	lineIndex: number;
	charIndex: number;
};

export const Char = ({ char }: { char: Symbol }) => {
	const dispatch = useAppDispatch();
	const { eitherTab } = useCurrentTab();
	const eitherPositions = useCurrentPositions();

	const [path, setPath] = React.useState<string>("");

	const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);

	React.useEffect(
		() =>
			eitherPositions
				.chain((p) =>
					fromBoolean(
						char.position.start.line === p[0].start.line && char.position.start.character === p[0].start.character,
					),
				)
				.fold(
					() => setIsCaretHere(false),
					() => setIsCaretHere(true),
				),
		[
			eitherPositions.fold(
				() => null,
				(p) => p,
			),
			char.position.start.line,
			char.position.start.character,
		],
	);

	React.useEffect(() => {
		setPath(
			eitherTab.fold(
				() => "",
				(t) => t.path,
			),
		);
	}, [
		eitherTab.fold(
			() => null,
			(t) => t.path,
		),
	]);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch({
			type: "@editor/update-caret-positions",
			payload: {
				path,
				positions: [
					{
						start: {
							line: char.position.start.line,
							character: char.position.start.character,
						},
						end: {
							line: char.position.start.line,
							character: char.position.start.character,
						},
						direction: "ltr",
					},
				],
			},
		});
	};

	return (
		<>
			<span onClick={handleClick}>{char.value}</span>
			{fromBoolean(isCaretHere).fold(NoOp, () => (
				<Caret />
			))}
		</>
	);
};
