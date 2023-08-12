import * as React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./app"

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
	<App id="http://localhost:3001" data="http://localhost:3002" web="http://localhost:8000" />
)
