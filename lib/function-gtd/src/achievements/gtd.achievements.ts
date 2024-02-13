import { DataProviders } from "@ordo-pink/frontend-create-function"
import { GTDRepository } from "../gtd.repository"
import { ORDO_PINK_GTD_FUNCTION } from "@ordo-pink/core"

type P = { commands: Client.Commands.Commands; data: DataProviders; staticHost: string }
export const registerAchievements = ({ commands, data, staticHost }: P) => {
	commands.emit<cmd.achievements.add>("achievements.add", {
		descriptor: {
			icon: `${staticHost}/3-labels.jpg`,
			completedAt: null,
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
			icon: `${staticHost}/10-labels.jpg`,
			completedAt: null,
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
			icon: `${staticHost}/25-labels.jpg`,
			completedAt: null,
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
			icon: `${staticHost}/50-inbox-tasks.jpg`,
			completedAt: null,
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
			icon: `${staticHost}/50-completed-inbox-tasks.jpg`,
			completedAt: null,
			description: "Выполните 50 задач в разделе 'Входящие', не перенося их в другие проекты.",
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
}
