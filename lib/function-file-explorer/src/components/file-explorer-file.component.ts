import {
	BsFileEarmark,
	BsFileEarmarkBinary,
	BsFileEarmarkRichText,
	BsFolderOpen,
} from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { Switch } from "@ordo-pink/switch"

export const FileExplorerFile = (metadata: TMetadata) => Maoka.pure("div", {}, () => "")
// 	create("div", ({ use }) => {
// 		const commands = use(get_commands)

// 		const metadata_fsid = metadata.get_fsid()
// 		const metadata_type = metadata.get_type()
// 		const metadata_size = metadata.get_size()
// 		const metadata_name = metadata.get_name()

// 		const children = use(get_metadata_children(metadata_fsid))

// 		const is_ordo_file = metadata_type === "text/ordo"
// 		const is_empty = metadata_size === 0
// 		const has_children = children.length > 0

// 		const context_menu_listener = listen("oncontextmenu", event => {
// 			event.preventDefault()

// 			commands.emit("cmd.application.context_menu.show", {
// 				event: event as any,
// 				payload: metadata,
// 			})
// 		})

// 		const click_listener = listen("onclick", event => {
// 			event.stopPropagation()
// 			commands.emit("cmd.file_explorer.go_to_file", metadata_fsid)
// 		})

// 		use(
// 			set_class(
// 				"flex flex-col p-1 w-14 items-center rounded-md cursor-pointer",
// 				"hover:bg-neutral-400 dark:hover:bg-neutral-600",
// 			),
// 		)
// 		use(set_attribute("title", metadata_name))
// 		use(context_menu_listener)
// 		use(click_listener)

// 		const FileIcon = Switch.OfTrue()
// 			.case(() => has_children, OrdoDirectoryIcon)
// 			.case(() => is_ordo_file && !is_empty, OrdoFileIcon)
// 			.case(() => is_ordo_file && is_empty, EmptyOrdoFileIcon)
// 			// TODO: File association icon
// 			.default(() => BsFileEarmarkBinary)

// 		return [FileIcon("size-12"), FileName(metadata_name)]
// 	})

// const OrdoFileIcon = () => BsFileEarmarkRichText
// const EmptyOrdoFileIcon = () => BsFileEarmark
// const OrdoDirectoryIcon = () => BsFolderOpen

// const FileName = (name: string) =>
// 	create("div", ({ use }) => {
// 		use(set_class("mt-1 line-clamp-2 break-all text-center text-xs transition-all duration-300"))

// 		return name
// 	})
