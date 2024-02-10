import { useStrictSubscription } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"

import Achievement from "./achievement.component"
import { achievements$ } from "@ordo-pink/frontend-stream-user"

export default function Achievements() {
	const achievements = useStrictSubscription(achievements$, [])

	return (
		<Card title="Достижения" className="md:col-span-2">
			{achievements.map(achievement => (
				<Achievement key={achievement.id} achievement={achievement} />
			))}
		</Card>
	)
}
