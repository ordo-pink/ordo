import { Location } from "history";
import qs from "querystringify";

type Props = {
	location: Location;
};

export const locationToRoute = ({ location }: Props) => {
	return {
		path: location.pathname,
		hash: location.hash,
		query: qs.parse(location.search),
	};
};
