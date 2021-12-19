import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./index.css";

import { store } from "./redux/store";
import { App } from "./app";
import { StatusBar } from "./status-bar/status-bar";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<StatusBar />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#app"),
);
