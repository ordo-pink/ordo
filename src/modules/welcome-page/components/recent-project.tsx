import { useAppDispatch, useAppSelector } from "@core/state/store";
import React from "react";

type RecentProjectProps = {
	path: string;
};

export const RecentProject: React.FC<RecentProjectProps> = ({ path }) => {
	const dispatch = useAppDispatch();

	const separator = useAppSelector((state) => state.app.internalSettings.separator);

	const [readableName, setReadableName] = React.useState<string>("");

	React.useEffect(() => {
		setReadableName(`...${separator}${path.split(separator).slice(-3).join(separator)}`);
	}, [path]);

	const handleClick = () => {
		dispatch({ type: "@file-explorer/list-folder", payload: path });
		dispatch({ type: "@side-bar/show" });
		dispatch({ type: "@activity-bar/open-editor" });
	};

	return (
		<div className="welcome-page_recent-project" onClick={handleClick}>
			{readableName}
		</div>
	);
};
