import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./app"
import "./index.css"

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.querySelector("#app"),
)
