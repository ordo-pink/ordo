import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"

import "./index.css"

import { store } from "./app/store"

import { App } from "./app"
import { Searcher } from "./searcher"
import { Creator } from "./creator"

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<Searcher />
			<Creator />
		</Provider>
	</React.StrictMode>,
	document.querySelector("#app"),
)
