import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { combineLatestWith } from "rxjs/internal/operators/combineLatestWith"
import { map } from "rxjs/internal/operators/map"

import { DataRepository, TDataCommands } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { LIB_DIRECTORY_FSID } from "@ordo-pink/core"
import { Oath } from "@ordo-pink/oath"
import { callOnce } from "@ordo-pink/tau"
import { data$ } from "@ordo-pink/frontend-stream-data"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"
import { user$ } from "@ordo-pink/frontend-stream-user"

type P = { fid: symbol; dataCommands: TDataCommands<string | ArrayBuffer> }
export const __initAchievements = callOnce(({ fid, dataCommands }: P) => {
	const commands = getCommands(fid)
	const logger = getLogger(fid)

	let registerred = false

	user$
		.pipe(
			combineLatestWith(data$),
			map(([user, data]) => {
				registerred
					? void 0
					: void Oath.fromNullable(data)
							.chain(data =>
								Oath.fromNullable(
									DataRepository.findData(
										data,
										item => item.name === "achievements.json" && item.parent === LIB_DIRECTORY_FSID,
									),
								),
							)
							.chain(data => Oath.fromNullable(user).map(user => ({ data, user })))
							.chain(({ data, user }) =>
								dataCommands
									.getContent({ fsid: data.fsid, createdBy: user.id })
									.chain(str =>
										Oath.try(() => JSON.parse(str as string)).chain(result =>
											result.error
												? Oath.reject()
												: Oath.resolve(result as Achievements.AchievementDAO[]),
										),
									)
									.fix(() => [] as Achievements.AchievementDAO[])
									.map(initialAchievements => {
										registerred = true

										achievements$.next(initialAchievements)

										commands.on<cmd.achievements.add>("achievements.add", achievement => {
											const grant = () => {
												const achievements = achievements$.value

												if (!achievements) return

												const thisAchievement = achievements.find(
													ach => ach && ach.id === achievement.descriptor.id,
												)

												if (!thisAchievement || thisAchievement.completedAt !== null) {
													return
												}

												thisAchievement.completedAt = new Date()
												achievements$.next(achievements)

												if (!achievements) return

												const content = JSON.stringify(
													achievements.filter(ach => !!ach.completedAt),
												)

												void dataCommands
													.uploadContent({
														content,
														contentType: "application/json",
														createdBy: user.id,
														fileLimit: user.fileLimit,
														length: content.length,
														name: "achievements.json",
														parent: LIB_DIRECTORY_FSID,
														updatedBy: user.id,
													})
													.orElse(console.log)

												commands.emit<cmd.notification.show>("notification.show", {
													type: "success",
													title: "Получено достижение!",
													Icon: () => (
														<img
															className="rounded-md"
															src={achievement.descriptor.icon}
															alt={achievement.descriptor.title}
														/>
													),
													id: achievement.descriptor.id,
													message: achievement.descriptor.title,
													duration: 15,
												})
											}

											const update = () =>
												// callback: (previousState: Achievements.AchievementDAO) => Achievements.AchievementDAO,
												{
													// const achievements = [...(achievements$.value ?? [])]
													// const thisAchievement = achievements.find(ach => ach.id === achievement.descriptor.id)
													// if (!thisAchievement || thisAchievement.completedAt != null) {
													// 	return
													// }
													// const updatedAchievement = callback(thisAchievement)
													// achievements.splice(achievements.indexOf(thisAchievement), 1, updatedAchievement)
													// achievements$.next(achievements)
												}

											if (
												!achievements$.value ||
												achievements$.value.some(ach => ach && ach.id === achievement.descriptor.id)
											)
												return

											achievements$.next([...achievements$.value, achievement.descriptor])
											achievement.subscribe({ grant, update })
										})

										return null
									}),
							)

							.orNothing()
			}),
		)
		.subscribe()

	logger.debug("Initialising achievements...")

	// let commandHandlerRegisterred = false

	// achievements$
	// 	.pipe(
	// 		combineLatestWith(data$, user$),
	// 		pairwise(),
	// 		map(([[prevAchievements], [achievements, data, user]]) => {
	// 			if (!data || !user) return

	// 			const persistedAchievementsData = DataRepository.findData(
	// 				data,
	// 				item => item.name === "achievements.json" && item.parent === LIB_DIRECTORY_FSID,
	// 			)

	// 			if (!commandHandlerRegisterred) {
	// 				commandHandlerRegisterred = true
	// 			}

	// 			if (!persistedAchievements$.value) {
	// 				if (!persistedAchievementsData) {
	// 					void dataCommands
	// 						.create({
	// 							name: "achievements.json",
	// 							parent: LIB_DIRECTORY_FSID,
	// 							contentType: "application/json",
	// 							fileLimit: user.fileLimit,
	// 							createdBy: user.id,
	// 						})
	// 						.toPromise()
	// 						.then(() => persistedAchievements$.next([]))
	// 				} else {
	// 					void dataCommands
	// 						.getContent({ fsid: persistedAchievementsData.fsid, createdBy: user.id })
	// 						.chain(str => Oath.try(() => JSON.parse(str as string)))
	// 						.fix(() => [])
	// 						.toPromise()
	// 						.then(achievements => persistedAchievements$.next(achievements))
	// 				}
	// 			}

	// 			if (!achievements) return

	// 			if (equals(prevAchievements, achievements)) return

	// 			const content = JSON.stringify(achievements)

	// 			void dataCommands
	// 				.updateContent({
	// 					fsid: persistedAchievementsData!.fsid,
	// 					createdBy: user.id,
	// 					updatedBy: user.id,
	// 					length: content.length,
	// 					content,
	// 				})
	// 				.toPromise()
	// 				.then(() => persistedAchievements$.next(achievements))
	// 		}),
	// 	)
	// 	.subscribe()

	logger.debug("Initialised achievements.")
})

export const getAchievements = (fid: symbol | null) =>
	Either.fromBoolean(() => KnownFunctions.checkPermissions(fid, { queries: [] })).fold(
		() => null,
		() => achievements$.value,
	)

// export const persistedAchievements$ = new BehaviorSubject<Achievements.AchievementDAO[] | null>(
// 	null,
// )
export const achievements$ = new BehaviorSubject<Achievements.AchievementDAO[] | null>(null)
