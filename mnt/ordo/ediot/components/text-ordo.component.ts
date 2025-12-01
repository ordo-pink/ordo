import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./text-ordo.styles.css"

export const text_ordo = maoka.create<OrdoClient.FileAssociation.ComponentArgs>(
	"div",
	async ({ content, data, is_editable, node, state, use }) => {
		use(ordo_client_maoka.context.provide(state))

		const id = ordo.data.get_id(data)
		const editor_state: Line[] = await oath
			.from_nullable(content)
			.pipe(oath.ops.chain(b => oath.from_promise(() => new Response(b).json())))
			.cata(oath.catas.or_else(() => []))

		const hunter = use(ordo_client_maoka.jabs.hunter)

		use(ordo_client_maoka.jabs.set_class("taxed"))

		if (is_editable) {
			use(ordo_client_maoka.jabs.set_attribute("contenteditable", "true"))
			use(
				ordo_client_maoka.jabs.listen("input", () => {
					if (maoka_dom.node_guard(node)) {
						editor_state[0] = node.value.innerText
						hunter.shoot("@ordo/main.content.set", { id, content: new Blob([JSON.stringify(editor_state)]) })
					}
				}),
			)
		}

		return () => wrapper(() => (editor_state.length ? editor_state.map(line => line) : placeholder(() => "Start typing...")))
	},
)

const wrapper = maoka_styled.div("lines-wrapper")
const placeholder = maoka_styled.div("placeholder")

type Line = string
