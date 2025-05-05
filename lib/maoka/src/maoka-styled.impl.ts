import { HTML_TAGS } from "./html-tags"
import { Maoka } from "./maoka.types"
import { maoka } from "./maoka.impl"
import { maoka_dom } from "./maoka-dom.impl"

export const maoka_styled = HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]:
			<$Args extends Maoka.BaseArgs | void = void>(
				classes: string,
				f?: (args: Maoka.Args<$Args> | Maoka.Kindergarten) => void,
			) =>
			(args: $Args) =>
				maoka.create<$Args>(tag, args => {
					args.use(maoka_dom.jabs.if_dom(n => n.value.setAttribute("class", classes)))
					f && f(args as any)
					return args.kindergarten
				})(args),
	}),
	{} as Record<
		(typeof HTML_TAGS)[number],
		<$Args extends Maoka.BaseArgs | void = void>(
			classes: string,
			f?: (args: Maoka.Args<$Args>) => void,
		) => (args: $Args | Maoka.Kindergarten) => Maoka.Component
	>,
)
