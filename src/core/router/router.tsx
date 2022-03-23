import React, { useContext, useLayoutEffect, useState } from "react";
import { createBrowserHistory, Location } from "history";
import { locationToRoute } from "./utils";
import { NotFound } from "./404";

const history = createBrowserHistory();

export const RouterContext = React.createContext({
	route: locationToRoute(history),
});

type Props = {
	routeList: { [route: string]: { path: string } };
	children: React.ReactNode;
};

const RouterProvider = ({ routeList, children }: Props) => {
	const [routes] = useState(Object.keys(routeList).map((key) => routeList[key].path));
	const [route, setRoute] = useState(locationToRoute(history));

	const handleRouteChange = (location: { location: Location }) => {
		const route = locationToRoute(location);
		setRoute(route);
	};
	const is404 = routes.indexOf(route.path) === -1;

	useLayoutEffect(() => {
		let unlisten = history.listen(handleRouteChange);
		return () => {
			unlisten();
		};
	}, []);

	return <RouterContext.Provider value={{ route }}>{is404 ? <NotFound /> : children}</RouterContext.Provider>;
};

const useRouter = () => useContext(RouterContext);

export { useRouter, RouterProvider, history };
