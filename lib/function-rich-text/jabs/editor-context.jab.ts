import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { TEditorContext } from "../rich-text.types"

export const editor_context = MaokaJabs.create_context<TEditorContext>()

export const editor_context_jab = editor_context.consume
