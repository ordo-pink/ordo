export type Suggestion = {
	text: string
	description: string
}

export type SuggestionsState = {
	enable: boolean
	show: boolean
	suggestions: Suggestion[]
}
