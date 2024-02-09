declare global {
	module cmd {
		module home {
			type goToHome = { name: "home.go-to-home" }
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
