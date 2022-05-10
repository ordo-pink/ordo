import React from "react";
import { SpringValue } from "react-spring";

import { ToggleHeading } from "@modules/welcome-page/components/toggle-heading";

export const OrdoHeading: React.FC<{ opacity: SpringValue<number>; toggle: boolean }> = ({ opacity, toggle }) => {
	const [output, setOutput] = React.useState<[number, number]>([1, 0]);
	const [range, setRange] = React.useState<[number, number]>([1.0, 0.0]);
	const [text, setText] = React.useState<string>("ORDO");

	React.useEffect(() => {
		setOutput(toggle ? [0, 1] : [1, 0]);
		setRange(toggle ? [0.0, 1.0] : [1.0, 0.0]);
		setText(toggle ? "||✔" : "ORDO");
	}, [toggle]);

	return (
		<ToggleHeading range={range} output={output} opacity={opacity}>
			{text}
		</ToggleHeading>
	);
};
