import React from "react";

export const StrikethroughWrapper =
	(): React.FC =>
	({ children }) =>
		<span className="line-through">{children}</span>;
