import { CheckboxInput, Dialog } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
// import { Result } from "@ordo-pink/result"

export const PublishMetadataModal = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		let checked = false
		const pages_to_publish: Ordo.Metadata.FSID[] = [fsid]

		// const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const action = () => {
			// if (checked)
			// 	metadata_query
			// 		.get_descendents(fsid)
			// 		.pipe(Result.ops.map(ds => ds.map(d => d.get_fsid())))
			// 		.pipe(Result.ops.map(ds => pages_to_publish.push(...ds)))

			pages_to_publish.forEach(fsid => commands.emit("cmd.metadata.publish", fsid))

			commands.emit("cmd.application.modal.hide")
		}

		return () =>
			Dialog({
				action_hotkey: "mod+enter",
				action_text: "Publish page",
				action,
				body: () =>
					BodyWrapper(() => [
						Info(
							() =>
								"Publishing a page will provide read only access to this page publicly. Even non-authenticated users will be able to see it.", // TODO i18n
						),
						CheckboxInput({
							label: "Publish nested files recursively?", // TODO i18n
							checked,
							on_change: () => {
								checked = !checked
							},
						}),
					]),
				title: "Publish",
			})
	})

const Info = Maoka.styled("p", { class: "text-sm text-neutral-500" })

const BodyWrapper = Maoka.styled("div", { class: "flex flex-col gap-2" })
