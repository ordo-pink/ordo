import { Maoka, MaokaStyled } from "./maoka.types"
import { HTML_TAGS } from "./html-tags"
import { maoka } from "./maoka.impl"
import { maoka_dom } from "./maoka-dom.impl"

export const maoka_styled: MaokaStyled.Instance = HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]: (classes: string, f?: Maoka.Fn<unknown>) => {
			if (!f)
				return (f: Maoka.Fn<unknown>) =>
					maoka.create(tag, (use, node) => {
						use(maoka_dom.jabs.if_dom(n => n.value.setAttribute("class", classes)))
						return f(use, node)
					})

			return maoka.create(tag, (use, node) => {
				use(maoka_dom.jabs.if_dom(n => n.value.setAttribute("class", classes)))
				return f(use, node)
			})
		},
	}),
	{} as MaokaStyled.Instance,
)
