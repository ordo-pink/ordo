import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "@core/state/store";
import "./index.css";
import { App } from "@containers/app";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#container"),
);
