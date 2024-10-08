import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { Hotkey } from "./hotkey.component"

import "./button.css"

export type TButtonProps = {
	on_click: (event: MouseEvent) => void
	custom_class?: string
	accelerator?: string
	text: string
}

const Default = ({ on_click, accelerator, text, custom_class = "" }: TButtonProps) =>
	Maoka.create("button", ({ use, element }) => {
		use(MaokaJabs.set_class("button", custom_class))
		use(
			MaokaJabs.listen("onclick", event => {
				if (element instanceof HTMLButtonElement) element.focus()
				on_click(event)
			}),
		)

		return () => [TextContainer(() => text), accelerator ? Hotkey(accelerator) : void 0]
	})

const TextContainer = Maoka.styled("div")

const Success = (params: TButtonProps) =>
	Default({ ...params, custom_class: `success ${params.custom_class}` })

const Neutral = (params: TButtonProps) =>
	Default({ ...params, custom_class: `neutral ${params.custom_class}` })

const Primary = (params: TButtonProps) =>
	Default({ ...params, custom_class: `primary ${params.custom_class}` })

export const Button = {
	Neutral,
	Success,
	Primary,
}
