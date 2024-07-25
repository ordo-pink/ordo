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

import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { useState } from "react"

import { useHosts, useIsDarkTheme } from "@ordo-pink/frontend-react-hooks"

import Null from "@ordo-pink/frontend-react-components/null"
import { Result } from "@ordo-pink/result"

type TFeature = { id: string; title: string; description: string }

export default function ScreenshotCarousel() {
	const is_dark_theme = useIsDarkTheme()
	const hosts_result = useHosts()

	const [current_index, set_current_index] = useState(0)

	return hosts_result
		.pipe(
			Result.ops.chain(hosts =>
				Result.FromNullable(FEATURES[current_index]).pipe(
					Result.ops.map(feature => ({ feature, static_host: hosts.static })),
				),
			),
		)
		.cata({
			Err: Null,
			Ok: ({ feature, static_host }) => (
				<div className="mt-12 rounded-lg bg-gradient-to-br from-rose-300 via-pink-300 to-fuchsia-300 p-8 shadow-xl dark:from-rose-700 dark:via-pink-500 dark:to-fuchsia-600">
					<div className="flex h-full flex-col items-center md:flex-row md:justify-between">
						<div className="w-full space-y-8 px-8 text-center">
							<div className="mt-8 flex items-center justify-center space-x-2">
								<button
									className="rounded-md border border-neutral-700 p-2 dark:border-neutral-300"
									onClick={() => {
										set_current_index(index => (index <= 0 ? FEATURES.length - 1 : index - 1))
									}}
								>
									<BsChevronLeft />
								</button>
								<button
									className="rounded-md border border-neutral-700 p-2 dark:border-neutral-300"
									onClick={() => {
										set_current_index(index => (index >= FEATURES.length - 1 ? 0 : index + 1))
									}}
								>
									<BsChevronRight />
								</button>
							</div>

							<h3 className="text-2xl font-black">{feature.title}</h3>
							<h4>{feature.description}</h4>

							<div className="flex w-full justify-center pb-8">
								<a
									href={`${static_host}/${feature.id}-${is_dark_theme ? "dark" : "light"}.png`}
									rel="noreferrer noopener"
									target="_blank"
								>
									<img
										className="size-full max-h-[42rem] max-w-4xl rounded-md shadow-lg"
										src={`${static_host}/${feature.id}-${is_dark_theme ? "dark" : "light"}.png`}
										alt={feature.title}
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
			),
		})
}

// --- Internal ---

const FEATURES: TFeature[] = [
	{
		id: "editor",
		title: "Редактор",
		description: "Текстовый редактор с поддержкой Markdown Shortcuts и поддержкой стилизации.",
	},
	{
		id: "quick-search",
		title: "Быстрый поиск по названию файла",
		description: "Поиск настолько быстрый, что на самом деле моментальный!",
	},
	{
		id: "commands",
		title: "Панель команд",
		description: "Быстрый доступ к действиям через Ctrl/Cmd + Shift + P",
	},
	{
		id: "labels",
		title: "Метки",
		description:
			"Теги для горизонтальной инклюзивной сейфспейс организации файлов. Без невнятных ограничений на использование пробелов!",
	},
	{
		id: "links",
		title: "Ссылки на файлы и папки",
		description: "Прямые ссылки на файлы для быстрого доступа между взаимозависимыми файлами.",
	},
	{
		id: "graph-2d",
		title: "Граф",
		description: "Граф связей между файлами и метками.",
	},
	{
		id: "graph-3d",
		title: "Граф 2",
		description: "И даже в 3D!",
	},
	{
		id: "gtd",
		title: "Getting Things Done",
		description: "Любой файл можно превратить в задачу в GTD-трекере. И даже папку!",
	},
]
