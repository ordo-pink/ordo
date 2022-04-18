import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

<<<<<<< HEAD
<<<<<<< HEAD
import "./index.css";

import { store } from "./redux/store";
import { App } from "./app";
=======
import { App } from "./app";
import { store } from "@core/store";

import "./index.css";
>>>>>>> ordo/main
=======
import { App } from "./app";
import { store } from "@core/state/store";

import "./index.css";

const appContainer = document.querySelector("#app");
>>>>>>> ordo-app/main

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
<<<<<<< HEAD
	document.querySelector("#app"),
=======
	appContainer,
>>>>>>> ordo-app/main
);
