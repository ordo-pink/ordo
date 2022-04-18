import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { App } from "./app";
import { store } from "@core/state/store";

import "./index.css";

const appContainer = document.querySelector("#app");

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	appContainer,
);
