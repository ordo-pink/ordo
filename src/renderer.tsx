import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "@core/state/store";
import "./index.css";
import { App } from "@containers/app";
import ErrorBoundary from "@core/error-boundary";

const app = (
	<React.StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<App />
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>
);

ReactDOM.render(app, document.querySelector("#container"));
