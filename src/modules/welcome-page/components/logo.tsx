import React from "react";
import { OrdoHeading } from "@modules/welcome-page/components/ordo-heading";

export const Logo: React.FC = () => {
	const [toggle, set] = React.useState<boolean>(false);

	const handleClick = () => set(!toggle);

	return (
		<div className="welcome-page_title-container" onClick={handleClick}>
			<OrdoHeading />
		</div>
	);
};
