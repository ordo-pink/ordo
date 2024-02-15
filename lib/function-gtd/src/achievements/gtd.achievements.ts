import { DataProviders } from "@ordo-pink/frontend-create-function"
import { Either } from "@ordo-pink/either"
import { ORDO_PINK_GTD_FUNCTION } from "@ordo-pink/core"
import { noop } from "@ordo-pink/tau"

import { GTDRepository } from "../gtd.repository"

type P = { commands: Client.Commands.Commands; data: DataProviders; staticHost: string }
export const registerAchievements = ({ commands, data, staticHost }: P) => {
	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			image: `${staticHost}/3-labels.jpg`,
			description: "Создайте 3 метки.",
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.3-labels"),
			title: "Red Label",
			category: "collection",
		},
		subscribe: ({ grant }) => {
			const labels = data.getDataLabels()

			if (labels.length >= 3) grant()

			commands.on<cmd.data.addLabel>("data.add-label", () => {
				const labels = data.getDataLabels()

				if (labels.length >= 2) grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.create-a-project"),
			title: "Опять работа?",
			description: "Создайте проект в задачах из файла.",
			category: "education",
			image: `${staticHost}/create-a-project.jpg`,
		},
		subscribe: ({ grant }) => {
			commands.on<cmd.gtd.addToProjects>("gtd.add-to-projects", () => {
				grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.add-task-to-project"),
			title: "Мушкет и жену не дам никому",
			description: "Добавьте задачу в проект.",
			category: "education",
			image: `${staticHost}/add-task-to-project.jpg`,
			previous: ORDO_PINK_GTD_FUNCTION.concat(".achievements.create-a-project"),
		},
		subscribe: ({ grant }) => {
			commands.on<cmd.data.create>("data.create", ({ parent }) => {
				if (!parent) return

				const allData = data.getData()

				GTDRepository.getClosestProjectE(allData, parent).fold(noop, grant)
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			image: `${staticHost}/10-labels.jpg`,
			description: "Создайте 10 меток.",
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.10-labels"),
			title: "Green Label",
			category: "collection",
			previous: ORDO_PINK_GTD_FUNCTION.concat(".achievements.3-labels"),
		},
		subscribe: ({ grant }) => {
			const labels = data.getDataLabels()

			if (labels.length >= 10) grant()

			commands.on<cmd.data.addLabel>("data.add-label", () => {
				const labels = data.getDataLabels()

				if (labels.length >= 9) grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			image: `${staticHost}/25-labels.jpg`,
			description: "Создайте 25 меток.",
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.25-labels"),
			title: "Blue Label",
			category: "collection",
			previous: ORDO_PINK_GTD_FUNCTION.concat(".achievements.10-labels"),
		},
		subscribe: ({ grant }) => {
			const labels = data.getDataLabels()

			if (labels.length >= 25) grant()

			commands.on<cmd.data.addLabel>("data.add-label", () => {
				const labels = data.getDataLabels()

				if (labels.length >= 24) grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			image: `${staticHost}/50-inbox-tasks.jpg`,
			description:
				"Накопите 50 невыполненных задач в разделе 'Входящие' и почувствуйте груз ответственности.",
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.50-inbox-items"),
			title: "Дед, пей таблетки",
			category: "challenge",
		},
		subscribe: ({ grant }) => {
			const files = data.selectDataList(
				item => GTDRepository.isInbox(item) && !GTDRepository.isDone(item),
			)

			if (files && files.length >= 50) grant()

			commands.on<cmd.data.create>("data.create", () => {
				const files = data.selectDataList(
					item => GTDRepository.isInbox(item) && !GTDRepository.isDone(item),
				)

				if (files && files.length >= 49) grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			image: `${staticHost}/50-completed-inbox-tasks.jpg`,
			description: "Выполните 50 задач в разделе 'Входящие', не перенося их в проекты.",
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.50-completed-inbox-items"),
			title: "Всё неправильно сделал",
			category: "challenge",
		},
		subscribe: ({ grant }) => {
			const files = data.selectDataList(
				item => GTDRepository.isInbox(item) && GTDRepository.isDone(item),
			)

			if (files && files.length >= 50) grant()

			commands.on<cmd.gtd.markDone>("gtd.mark-done", () => {
				const files = data.selectDataList(
					item => GTDRepository.isInbox(item) && GTDRepository.isDone(item),
				)

				if (files && files.length >= 49) grant()
			})
		},
	})

	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			id: ORDO_PINK_GTD_FUNCTION.concat(".achievements.complete-a-project"),
			image: `${staticHost}/complete-a-project.jpg`,
			title: "Душно как!",
			description: "Выполните все задачи в одном проекте, состоящем из 50 задач и более.",
			category: "challenge",
		},
		subscribe: ({ grant }) => {
			const allData = data.getData()
			const projects = GTDRepository.getProjects(allData)

			projects.forEach(project => {
				const children = data.getChildren(project.fsid)

				if (children.length >= 50 && children.every(GTDRepository.isDone)) {
					grant()
				}
			})

			commands.on<cmd.gtd.markDone>("gtd.mark-done", fsid => {
				const allData = data.getData()

				GTDRepository.getClosestProjectE(allData, fsid)
					.chain(project => Either.of(data.getChildren(project.fsid)))
					.map(children => children.filter(GTDRepository.isDone))
					.chain(children => Either.fromBoolean(() => children.length >= 49))
					.fold(noop, grant)
			})
		},
	})
}
