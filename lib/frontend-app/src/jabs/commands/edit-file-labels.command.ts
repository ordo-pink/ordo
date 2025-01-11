import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { is_string } from "@ordo-pink/tau"

import { EditLabelModal } from "../../components/edit-label-modal.component"

export const edit_file_labels_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_edit_label_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_edit_label_modal"> = label => {
		const Component = MaokaOrdo.Components.WithState(state, () => EditLabelModal(label))
		state.commands.emit("cmd.application.modal.show", { render: div => void Maoka.render_dom(div, Component) })
	}

	const handle_show_edit_labels_palette: Ordo.Command.HandlerOf<"cmd.metadata.show_edit_labels_palette"> = fsid => {
		const show_labels_palette = () => {
			const current_labels = state.metadata_query
				.get_by_fsid(fsid)
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(R.ops.map(metadata => metadata.get_labels()))
				.cata(R.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			const available_labels = state.metadata_query
				.get()
				.pipe(R.ops.map(metadata => metadata.flatMap(item => item.get_labels())))
				.pipe(R.ops.map(labels => labels.map(label => (is_string(label) ? label : label.name))))
				.pipe(R.ops.map(labels => [...new Set(labels)]))
				.pipe(
					R.ops.map(labels =>
						labels.filter(
							label =>
								!current_labels.some(current_label =>
									is_string(current_label) ? current_label === label : current_label.name === label,
								),
						),
					),
				)
				.cata(R.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			state.commands.emit("cmd.application.command_palette.show", {
				is_multiple: true,
				on_new_item: value => {
					state.commands.emit("cmd.metadata.add_labels", { fsid, labels: [value] })
					show_labels_palette()
				},
				items: available_labels.map(label => ({
					readable_name: (is_string(label) ? label : label.name) as Ordo.I18N.TranslationKey,
					on_select: () => state.commands.emit("cmd.metadata.add_labels", { fsid, labels: [label] }),
				})),
				max_items: 200,
				pinned_items: current_labels.map(label => ({
					readable_name: (is_string(label) ? label : label.name) as Ordo.I18N.TranslationKey,
					on_select: () => state.commands.emit("cmd.metadata.remove_labels", { fsid, labels: [label] }),
				})),
			})
		}

		show_labels_palette()
	}

	state.commands.on("cmd.metadata.show_edit_label_modal", handle_show_edit_label_modal)
	state.commands.on("cmd.metadata.show_edit_labels_palette", handle_show_edit_labels_palette)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_edit_labels_palette",
		// TODO render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
		readable_name: "t.common.metadata.show_edit_labels_palette", // TODO
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => (Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null),
		type: ContextMenuItemType.CREATE,
	})

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_edit_label_modal", handle_show_edit_label_modal)
		state.commands.off("cmd.metadata.show_edit_labels_palette", handle_show_edit_labels_palette)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_edit_labels_palette")
	})
}
