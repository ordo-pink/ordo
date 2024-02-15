import { achievements$ } from "@ordo-pink/frontend-stream-achievements"
import { useStrictSubscription } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"

import Achievement from "./achievement.component"

export default function Achievements() {
	const achievements = useStrictSubscription(achievements$, [])

	const visibleAchievements = achievements
		.filter(ach => {
			const previous = achievements.find(item => item.id === ach.previous)
			const next = achievements.find(item => item.previous === ach.id)

			// Show achievement since it's not in an achievement chain
			if (!next && !previous) return true
			// Show achievement since it's the first achievement in the chain and it is not obtained yet
			if (!previous && !ach.completedAt) return true
			// Hide achievement since previous steps were not completed
			if (previous && !previous.completedAt) return false
			// Show achievement since it's a current achievement to be obtained in the chain
			if (previous && previous.completedAt && !ach.completedAt) return true
			// Show achievement since it is obtained and it is the last achievement in the chain
			if (!next && ach.completedAt) return true
			// Show achievement since it's the most recent achievement in the chain obtained by the user
			if (next && !next.completedAt && ach.completedAt) return true
			// Show achievement since it's the most recent achievement in the chain obtained by the user
			if (next && !next.completedAt && !ach.completedAt) return true

			return false
		})
		.sort((a, b) =>
			!a.completedAt ? 1 : !b.completedAt ? -1 : a.completedAt > b.completedAt ? -1 : 1,
		)

	return (
		<Card title="Достижения" className="md:col-span-2">
			{visibleAchievements.map(achievement => (
				<Achievement key={achievement.id} achievement={achievement} />
			))}
		</Card>
	)
}
