import { enablePatches } from "immer"
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./app"

import "./index.css"

enablePatches()

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.querySelector("#app"),
)
