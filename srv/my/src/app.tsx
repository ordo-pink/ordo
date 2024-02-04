import { useEffect, useState } from "react"
import { useCommands } from "@ordo-pink/frontend-stream-commands"

function App() {
	const [count, setCount] = useState(0)
	const commands = useCommands()

	useEffect(() => {
		commands.on("hello.world", () => console.log("HEY"))
	})

	return (
		<>
			<h1>Vite + React</h1>
			<div className="card">
				<button
					onClick={() => {
						if (count % 2 === 0) commands.emit("hello.world")
						else commands.cancel("hello.world")
						setCount(count => count + 1)
					}}
				>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the {String(import.meta.env.VITE_ORDO_DT_HOST)} and React logos to learn more
			</p>
		</>
	)
}

export default App
