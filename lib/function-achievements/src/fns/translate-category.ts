import { Switch } from "@ordo-pink/switch"

export const translateCategory = (category: Achievements.AchievementCategory) =>
	Switch.of(category)
		.case("challenge", () => "Испытания")
		.case("collection", () => "Коллекции")
		.case("education", () => "Обучение")
		.case("legacy", () => "Наследие")
		.default(() => "🤔")
