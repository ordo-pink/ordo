import React from "react";
import { Link } from "./link";

export function NotFound() {
	return (
		<div>
			<p>404 - Not Found</p>
			<Link to="/">Back to Welcome</Link>
		</div>
	);
}
