import React from "react";

type Config = {
	isCurrentLine: boolean;
};

export const HrWrapper =
	({ isCurrentLine }: Config): React.FC =>
	({ children }) =>
		isCurrentLine ? <span>{children}</span> : <hr />;
