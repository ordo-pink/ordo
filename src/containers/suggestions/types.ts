import { OrdoEvent } from "../../common/types"

export type SUGGESTIONS_SCOPE = "suggestions"

export type SuggestionsEvent =
	| OrdoEvent<SUGGESTIONS_SCOPE, "get-items", string | void>
	| OrdoEvent<SUGGESTIONS_SCOPE, "enable">
	| OrdoEvent<SUGGESTIONS_SCOPE, "disable">
	| OrdoEvent<SUGGESTIONS_SCOPE, "toggle">
	| OrdoEvent<SUGGESTIONS_SCOPE, "show">
	| OrdoEvent<SUGGESTIONS_SCOPE, "hide">
	| OrdoEvent<SUGGESTIONS_SCOPE, "use", string>

export type Suggestion = {
	text: string
	description: string
	value: string
}

export type SuggestionsState = {
	enabled: boolean
	show: boolean
	items: Suggestion[]
}
