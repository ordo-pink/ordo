import React from "react";
import Split from "react-split";

import { StatusBar } from "@containers/status-bar";
import { Workspace } from "@containers/workspace";
import { Sidebar } from "@containers/side-bar";
import { applyStatePatches, setState, useInternalDispatch, useAppSelector, useAppDispatch } from "@core/state/store";
import { TopBar } from "@modules/top-bar";
import { ActivityBar } from "@modules/activity-bar";

export const App: React.FC = () => {
	const internalDispatch = useInternalDispatch();
	const dispatch = useAppDispatch();

	const showSidebar = useAppSelector((state) => state.sideBar.show);
	const sideBarWidth = useAppSelector((state) => state.sideBar.width);
	const settingsSideBarWidth = useAppSelector((state) => state.app.internalSettings.window?.sideBarWidth);

	const [targetSideBarWidth, setTargetSideBarWidth] = React.useState<number>(sideBarWidth);
	const [sizes, setSizes] = React.useState<[number, number]>([100, 0]);

	const handleApplyPatches = React.useCallback(({ detail }: any) => internalDispatch(applyStatePatches(detail)), []);
	const handleSetState = React.useCallback(({ detail }: any) => internalDispatch(setState(detail)), []);

	React.useEffect(() => {
		setTargetSideBarWidth(settingsSideBarWidth != null ? sideBarWidth : settingsSideBarWidth);
	}, [sideBarWidth, settingsSideBarWidth]);

	React.useEffect(() => {
		setSizes(showSidebar ? [100 - targetSideBarWidth, targetSideBarWidth] : [100, 0]);
	}, [showSidebar, targetSideBarWidth]);

	React.useEffect(() => {
		dispatch({ type: "@app/get-state" });
		dispatch({ type: "@app/get-internal-settings" });
		dispatch({ type: "@app/get-user-settings" });

		window.addEventListener("@app/set-state", handleSetState);
		window.addEventListener("@app/apply-patches", handleApplyPatches);

		return () => {
			window.removeEventListener("@app/set-state", handleApplyPatches);
			window.removeEventListener("@app/apply-patches", handleApplyPatches);
		};
	}, []);

	return (
		<>
			<div className="flex w-full h-full">
				<div className="mt-2 mb-6">
					<ActivityBar />
				</div>

				<div className="flex flex-col w-full h-full">
					<TopBar />
					<div className="flex flex-grow h-[calc(100%-3.75rem)]">
						<Split
							className="flex w-full h-full"
							sizes={sizes}
							minSize={0}
							snapOffset={200}
							onDragEnd={(sizes) => dispatch({ type: "@side-bar/set-width", payload: sizes[1] })}
						>
							{/* <Split
						className="flex flex-col justify-between"
						direction="vertical"
						sizes={showPanel ? [100 - panelHeight, panelHeight] : [100, 0]}
						minSize={0}
						snapOffset={100}
						onDragEnd={(sizes) => dispatch(setPanelHeight(sizes[1]))}
					> */}
							<div className="h-full">
								<Workspace />
							</div>
							{/* <div className="h-full shadow-xl rounded-t-xl bg-neutral-200  dark:bg-neutral-800">
							<Panel />
						</div>
					</Split> */}
							<div className="shadow-xl rounded-tl-xl mt-2 bg-neutral-200  dark:bg-neutral-600">
								<Sidebar />
							</div>
						</Split>
					</div>
				</div>
			</div>
			<div className="fixed bottom-0 left-0 right-0 bg-neutral-200  dark:bg-neutral-800">
				<StatusBar />
			</div>
		</>
	);
};
