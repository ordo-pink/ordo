import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import Heading from "@ordo-pink/frontend-react-components/heading"
import OrdoButton from "@ordo-pink/frontend-react-components/button"

export default function App() {
	return (
		<CenteredPage centerX centerY>
			<Heading level="2" styledFirstLetter>
				Vite + React
			</Heading>
			<div>
				<OrdoButton.Primary onClick={() => console.log("HEY")}>Hey</OrdoButton.Primary>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p>Click on the {String(import.meta.env.VITE_ORDO_DT_HOST)} and React logos to learn more</p>
		</CenteredPage>
	)
}
