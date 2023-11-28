import { TSwitch } from "@ordo-pink/switch"
import { ReactEditor, RenderElementProps } from "slate-react"

export type CreateEditorPluginContext = {
	editor: ReactEditor
	extendComponentSwitch: (
		swich: TSwitch<RenderElementProps, [JSX.Element]>,
	) => TSwitch<RenderElementProps, [JSX.Element]>
}
export type CreateEditorPluginFn = (ctx: CreateEditorPluginContext) => CreateEditorPluginContext

export const createEditorPlugin =
	(callback: CreateEditorPluginFn) =>
	({ editor, extendComponentSwitch = x => x }: CreateEditorPluginContext) =>
		callback({ editor, extendComponentSwitch })
