import * as MAOKA_STYLED from "./maoka-styled.constants.ts"
import type * as Maoka from "../maoka/maoka.types.ts"
import type * as MaokaStyled from "./maoka-styled.types.ts"
import * as maoka from "../maoka/maoka.impl.ts"
import * as maoka_dom from "../maoka-dom/maoka-dom.impl.ts"

const tags: MaokaStyled.Instance = MAOKA_STYLED.HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]:
			<$Args extends Maoka.BaseArgs | void = void>(
				classes?: string,
				on_create?: (args: Maoka.Args<$Args> | Maoka.Kindergarten) => void,
			) =>
			(args: $Args) =>
				maoka.create<$Args>(tag, args => {
					if (classes) args.use(maoka_dom.jabs.hit_if_dom(n => n.value.setAttribute("class", classes)))
					on_create && on_create(args as any)

					return args.kindergarten
				})(args),
	}),
	{} as MaokaStyled.Instance,
)

export default tags
