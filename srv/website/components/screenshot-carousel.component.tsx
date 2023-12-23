// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { useState } from "react"
import Null from "./null"
import { useIsDarkTheme } from "hooks/use-is-dark-theme.hook"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"

type Feature = {
	id: string
	title: string
	description: string
}

type P = { staticHost: string }
export default function ScreenshotCarousel({ staticHost }: P) {
	const isDarkTheme = useIsDarkTheme()
	const features: Feature[] = [
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

	const [currentIndex, setCurrentIndex] = useState(0)

	return Either.fromNullable(features[currentIndex]).fold(Null, feature => (
		<div className="bg-gradient-to-br from-rose-300 dark:from-rose-700 via-pink-300 dark:via-pink-500 to-fuchsia-300 dark:to-fuchsia-600 rounded-lg p-8 mt-12 shadow-xl">
			<div className="flex flex-col md:flex-row h-full items-center md:justify-between">
				<div className="w-full px-8 pb-8 text-center">
					<h3 className="font-black text-2xl pb-8">{feature.title}</h3>
					<h4>{feature.description}</h4>

					<div className="flex space-x-2 items-center justify-center mt-8">
						<button
							className="border border-neutral-700 dark:border-neutral-300 p-2 rounded-md"
							onClick={() => {
								setCurrentIndex(index => (index <= 0 ? features.length - 1 : index - 1))
							}}
						>
							<BsChevronLeft />
						</button>
						<button
							className="border border-neutral-700 dark:border-neutral-300 p-2 rounded-md"
							onClick={() => {
								setCurrentIndex(index => (index >= features.length - 1 ? 0 : index + 1))
							}}
						>
							<BsChevronRight />
						</button>
					</div>
				</div>

				<div className="w-full flex justify-end">
					<a
						href={`${staticHost}/${feature.id}-${isDarkTheme ? "dark" : "light"}.png`}
						rel="noreferrer noopener"
						target="_blank"
					>
						<img
							className="rounded-md shadow-lg h-full max-h-96"
							src={`${staticHost}/${feature.id}-${isDarkTheme ? "dark" : "light"}.png`}
							alt={feature.title}
						/>
					</a>
				</div>
			</div>
		</div>
	))
}
