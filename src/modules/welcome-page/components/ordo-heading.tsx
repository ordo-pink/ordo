import React from "react";

import { ToggleHeading } from "@modules/welcome-page/components/toggle-heading";
import { FoldVoid, fromBoolean } from "@utils/either";
// @ts-ignore
import Logo from "./ordo.svg";

export const OrdoHeading: React.FC = () => {
	return (
		<ToggleHeading>
			<Logo width={250} fill="transparent" />
		</ToggleHeading>
	);
};
