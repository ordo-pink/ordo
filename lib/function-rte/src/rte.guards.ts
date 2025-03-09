import { is_array, is_bool, is_finite_non_negative_int, is_non_empty_string, is_object, is_string } from "@ordo-pink/tau"

import {
	type TRTECodeNode,
	type TRTEEmbedNode,
	type TRTEHeaderNode,
	type TRTENode,
	type TRTEParagraphNode,
	type TRTEParent,
	type TRTETextNode,
} from "./rte.types"

export const is_rte_node = (x: any): x is TRTENode => is_object(x) && is_non_empty_string(x.type)

export const is_rte_parent = (x: any): x is TRTEParent => is_rte_node(x) && is_array(x.children)

export const is_rte_text_node = (x: any): x is TRTETextNode =>
	is_rte_node(x) && x.type === "text" && is_string(x.value) && is_array(x.styles)

export const is_rte_code_node = (x: any): x is TRTECodeNode => is_rte_node(x) && x.type === "code" && is_string(x.value)

export const is_rte_paragraph_node = (x: any): x is TRTEParagraphNode => is_rte_parent(x) && x.type === "p"

export const is_rte_embed_node = (x: any): x is TRTEEmbedNode =>
	is_rte_node(x) && x.type === "embed" && is_bool(x.internal) && is_string(x.target)

export const is_rte_header_node = (x: any): x is TRTEHeaderNode =>
	is_rte_parent(x) && x.type === "h" && [1, 2, 3, 4, 5, 6].includes(x.level as any)

export const is_rte_context_menu_payload = (
	x: Ordo.ContextMenu.Params<any>,
): x is Ordo.ContextMenu.Params<{ location: "rte"; block_index: number }> => {
	if (!x.payload) return false

	return x.payload.location === "rte" && is_finite_non_negative_int(x.payload.block_index)
}
