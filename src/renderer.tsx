import { enablePatches } from "immer"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { App } from "./app"
import { store } from "./common/store"

import "./index.css"

enablePatches()

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#app"),
)
