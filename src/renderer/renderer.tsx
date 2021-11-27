import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { store } from "./app/store"
import { App } from "./app"
import "./index.css"

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#app"),
)
