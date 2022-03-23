import { ActivityBar } from "@containers/activity-bar";
import { Panel } from "@containers/panel";
import { Sidebar } from "@containers/sidebar";
import { StatusBar } from "@containers/status-bar";
import { TopBar } from "@containers/top-bar";
import { Workspace } from "@containers/workspace";
import { Link } from "@core/router/link";
import { Route } from "@core/router/route";
import { RouterProvider } from "@core/router/router";
import React from "react";
import ReactDOM from "react-dom";
import Split from "react-split";

import "./index.css";

const appContainer = document.querySelector("#app");

const routes = {
	welcome: {
		path: "/main_window",
	},
	another: {
		path: "/main_window/another",
	},
};

ReactDOM.render(
	<React.StrictMode>
		<TopBar />
		<div className="flex h-[calc(100%-3.75rem)]">
			<ActivityBar />
			<Split className="flex select-none w-full h-full" sizes={[80, 20]} minSize={0} snapOffset={200}>
				<Split className="flex flex-col justify-between" direction="vertical" sizes={[80, 20]} minSize={0} snapOffset={100}>
					<div className="px-2">
						<Workspace />
					</div>
					<div className="h-full shadow-xl rounded-t-xl bg-neutral-200  dark:bg-neutral-800">
						<Panel />
					</div>
				</Split>
				<div className="shadow-xl rounded-tl-xl mt-2 bg-neutral-200  dark:bg-neutral-800">
					<Sidebar />
				</div>
			</Split>
		</div>
		<div className="fixed bottom-0 left-0 right-0 bg-neutral-200  dark:bg-neutral-800">
			<StatusBar />
		</div>
		{/* <RouterProvider routeList={routes}>
			<Route path={routes.welcome.path}>
				<p>Hi</p>
				<Link to={routes.another.path}>Go to another</Link>
			</Route>

			<Route path={routes.another.path}>
				<p>Hi</p>
				<Link to={routes.welcome.path}>Go to Welcome</Link>
			</Route>
		</RouterProvider> */}
	</React.StrictMode>,
	appContainer,
);
