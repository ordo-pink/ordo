import * as React from "react"
import * as ReactDOM from "react-dom/client"
import App from "./app"

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
	<App
		id={process.env.REACT_APP_ID_HOST!}
		data={process.env.REACT_APP_DATA_HOST!}
		web={process.env.REACT_APP_WEB_HOST!}
	/>
)
