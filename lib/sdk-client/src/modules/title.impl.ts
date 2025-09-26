declare global {
	interface cmd {
		title: {
			set_title: { args: OrdoClient.Translations.Key }
		}
	}
}

export {}
