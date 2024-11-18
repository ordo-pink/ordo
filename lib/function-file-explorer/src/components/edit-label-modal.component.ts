import { Dialog, Input, Select, color_class } from "@ordo-pink/maoka-components"
import { is_non_empty_string, is_string, title_case } from "@ordo-pink/tau"
import { LabelColor } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const EditLabelModal = (ctx: Ordo.CreateFunction.Params, label: Ordo.Metadata.Label) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		const commands = use(MaokaOrdo.Jabs.Commands)

		const is_string_label = is_string(label)
		const initial_name = is_string_label ? label : label.name
		const initial_color = is_string_label ? LabelColor.DEFAULT : label.color

		let name = initial_name
		let color = initial_color

		const color_items = color_class.map((_, i) => ({
			title: title_case(LabelColor[i]),
			value: i as LabelColor,
			render_info: () => LabelCircle(i),
		}))

		const current_color = is_string_label
			? color_items[0]
			: color_items.find(item => item.value === label.color) ?? color_items[0] // TODO Log error, this is wrong

		return () =>
			Dialog({
				title: `Edit label "${initial_name}"`, // TODO Translations
				action: () => {
					commands.emit("cmd.metadata.edit_label", {
						old_label: label,
						new_label:
							is_string_label && color === LabelColor.DEFAULT
								? name
								: { color: is_string_label ? LabelColor.DEFAULT : color, name },
					})

					commands.emit("cmd.application.modal.hide")
				},
				action_text: "Save",
				body: () =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("flex flex-col gap-2"))
						return () => [
							Input.Text({
								autofocus: true,
								initial_value: name,
								label: "Edit label name", // TODO Translations
								on_input: event => {
									const target = event.target as HTMLInputElement
									name = target.value
								},
								validate: is_non_empty_string,
								validation_error_message: "Can't be empty", // TODO Translations
								required: true,
								placeholder: "hashtag101",
							}),
							// TODO Color select (extract select from create modal to separate component)
							Select({
								current_value: current_color,
								items: color_items,
								on_select: value => {
									color = value
								},
							}),
						]
					}),
			})
	})

const LabelCircle = (color: LabelColor) =>
	Maoka.styled("div", { class: `label ${color_class[color]} size-3 !rounded-full` })(() => {})
