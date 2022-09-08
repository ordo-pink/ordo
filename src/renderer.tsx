import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "@core/state/store";

import ErrorBoundary from "@core/error-boundary";
import App from "@containers/app";

import "./index.css";
import "./i18n";

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
