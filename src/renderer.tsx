import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

<<<<<<< HEAD
import "./index.css";

import { store } from "./redux/store";
import { App } from "./app";
=======
import { App } from "./app";
import { store } from "@core/store";

import "./index.css";
>>>>>>> ordo/main

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#app"),
);
