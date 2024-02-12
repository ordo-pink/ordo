declare global {
	module cmd {
		module home {
			type goToHome = { name: "home.go-to-home" }
			type openTelegramSupport = { name: "home.open-telegram-support" }
			type openEmailSupport = { name: "home.open-email-support" }
			type openSupport = { name: "home.open-support" }
		}
	}
}

export type News = {
	title: string
	shortMessage: string
	message: string
	date: Date
	url: string
}
