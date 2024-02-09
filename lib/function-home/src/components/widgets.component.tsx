import { type ComponentType } from "react"

import Card from "@ordo-pink/frontend-react-components/card"
import { Either } from "@ordo-pink/either"
import Null from "@ordo-pink/frontend-react-components/null"

type P = { widgets?: ComponentType[]; activityName: string }
export default function Widgets({ widgets, activityName }: P) {
	return Either.fromNullable(widgets).fold(Null, widgets => (
		<>
			{widgets.map((Widget, index) => (
				<Card key={`${activityName}-${index}`}>
					<Widget />
				</Card>
			))}
		</>
	))
}
