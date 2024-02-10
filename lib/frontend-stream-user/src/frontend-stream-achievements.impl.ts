import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getFetch } from "@ordo-pink/frontend-fetch"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initAchievements = callOnce((fid: symbol) => {
	const commands = getCommands(fid)
	const fetch = getFetch(fid)
	const logger = getLogger(fid)

	logger.debug("Initialising user...")

	commands.on<cmd.achievements.add>("achievements.add", achievement => {
		achievements$.next(achievements$.value.concat(achievement.descriptor))

		const grant = () => {
			const achievements = achievements$.value

			const thisAchievement = achievements.find(ach => ach.id === achievement.descriptor.id)

			if (!thisAchievement || thisAchievement.completedAt != null) return

			thisAchievement.completedAt = new Date()

			achievements$.next(achievements)

			commands.emit<cmd.notification.show>("notification.show", {
				type: "success",
				title: "Получено достижение!",
				id: achievement.descriptor.id,
				message: achievement.descriptor.title,
				duration: 10,
			})
		}
		const update = () => console.log("ACHIEVEMENT UPDATED")

		if (!achievement.descriptor.completedAt) achievement.subscribe({ grant, update })
	})

	logger.debug("Initialised user.")
})

export const getAchievements = (fid: symbol | null) =>
	Either.fromBoolean(() => KnownFunctions.checkPermissions(fid, { queries: [] })).fold(
		() => null,
		() => achievements$.value,
	)

export const achievements$ = new BehaviorSubject<Achievements.AchievementDAO[]>([])
