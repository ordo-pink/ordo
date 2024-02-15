import { type ComponentType, Suspense } from "react"

import { Either } from "@ordo-pink/either"

import Card from "@ordo-pink/frontend-react-components/card"
import Loader from "@ordo-pink/frontend-react-components/loader"
import Null from "@ordo-pink/frontend-react-components/null"

type P = { widgets?: ComponentType[]; activityName: string }
export default function Widgets({ widgets, activityName }: P) {
	return Either.fromNullable(widgets).fold(Null, widgets => (
		<>
			{widgets.map((Widget, index) => (
				<Card key={`${activityName}-${index}`}>
					<Suspense fallback={<WidgetFallback />}>
						<Widget />
					</Suspense>
				</Card>
			))}
		</>
	))
}

const WidgetFallback = () => (
	<div className="size-full">
		<Loader />
	</div>
)
