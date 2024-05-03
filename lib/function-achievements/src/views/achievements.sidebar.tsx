import { useRouteParams, useUserAchievements } from "@ordo-pink/frontend-react-hooks"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import Null from "@ordo-pink/frontend-react-components/null"

import { translateCategory } from "../fns/translate-category"

export default function AchievementsSidebar() {
	const achievements = useUserAchievements()
	const { category } = useRouteParams<{ category: Achievements.AchievementCategory }>()
	const categories = Array.from(
		new Set(achievements.reduce((acc, v) => acc.concat(v.category), [] as string[])),
	).sort((a, b) => a.localeCompare(b)) as Achievements.AchievementCategory[]

	return (
		<div>
			<ActionListItem Icon={Null} current={!category} text="Главная" href="/achievements" />
			{categories.map(c => (
				<ActionListItem
					key={c}
					Icon={Null}
					current={category === c}
					text={translateCategory(c)}
					href={`/achievements/${c}`}
				/>
			))}
		</div>
	)
}
