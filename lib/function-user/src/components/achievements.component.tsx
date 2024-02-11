import { achievements$ } from "@ordo-pink/frontend-stream-achievements"
import { useStrictSubscription } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"

import Achievement from "./achievement.component"

export default function Achievements() {
	const achievements = useStrictSubscription(achievements$, [])

	return (
		<Card title="Достижения" className="md:col-span-2">
			{achievements
				.sort((a, b) =>
					!a.completedAt ? 1 : !b.completedAt ? -1 : a.completedAt > b.completedAt ? -1 : 1,
				)
				.map(achievement => (
					<Achievement key={achievement.id} achievement={achievement} />
				))}
		</Card>
	)
}
