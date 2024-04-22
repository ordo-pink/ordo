// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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

	logger.debug("Initialising achievements...")

	let registerred = false

	user$
		.pipe(
			combineLatestWith(data$),
			map(([user, data]) => {
				registerred
					? void 0
					: void Oath.fromNullable(data)
							.chain(data => Oath.fromNullable(user).map(user => ({ data, user })))
							.chain(({ user, data }) =>
								Oath.fromNullable(
									DataRepository.findData(
										data,
										item => item.name === "achievements.json" && item.parent === LIB_DIRECTORY_FSID,
									),
								)
									.rejectedChain(() =>
										dataCommands.create({
											name: "achievements.json",
											parent: LIB_DIRECTORY_FSID,
											createdBy: user.id,
											fileLimit: user.fileLimit,
										}),
									)
									.map(data => ({ user, data })),
							)
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

												if (!thisAchievement || thisAchievement.completedAt != null) {
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
															src={achievement.descriptor.image}
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
												return null

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
