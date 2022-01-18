import React from "react"
import { Either } from "../../common/eithers"
import { Suggestion, SuggestionsState } from "./types"

const Suggestion: React.FC<Suggestion> = ({ text, description, value }) => (
	<div onClick={() => window.ordo.emit("@suggestions/use", value)}>
		<p>{text}</p>
		<p>{description}</p>
	</div>
)

export const SuggestionsMenu: React.FC<SuggestionsState> = ({ enabled, show, items }) =>
	Either.fromBoolean(enabled)
		.chain(() => Either.fromBoolean(show))
		.chain(() => Either.fromEmptyArray(items))
		.fold(
			() => null,
			() => (
				<div>
					{items.map((item) => (
						<Suggestion key={item.text} text={item.text} description={item.description} value={item.value} />
					))}
				</div>
			),
		)
