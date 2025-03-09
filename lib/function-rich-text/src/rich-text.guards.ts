import { is_array, is_bool, is_non_empty_string, is_object, is_string } from "@ordo-pink/tau"

import {
	type TOrdoRTECodeNode,
	type TOrdoRTEEmbedNode,
	type TOrdoRTEHeaderNode,
	type TOrdoRTENode,
	type TOrdoRTEParagraphNode,
	type TOrdoRTEParent,
	type TOrdoRTETextNode,
} from "../rich-text.types"

export const is_ordo_rte_node = (x: any): x is TOrdoRTENode => is_object(x) && is_non_empty_string(x.type)

export const is_ordo_rte_parent = (x: any): x is TOrdoRTEParent => is_ordo_rte_node(x) && is_array(x.children)

export const is_ordo_rte_text_node = (x: any): x is TOrdoRTETextNode =>
	is_ordo_rte_node(x) && x.type === "text" && is_string(x.value) && is_array(x.styles)

export const is_ordo_rte_code_node = (x: any): x is TOrdoRTECodeNode =>
	is_ordo_rte_node(x) && x.type === "code" && is_string(x.value)

export const is_ordo_rte_paragraph_node = (x: any): x is TOrdoRTEParagraphNode => is_ordo_rte_parent(x) && x.type === "p"

export const is_ordo_rte_embed_node = (x: any): x is TOrdoRTEEmbedNode =>
	is_ordo_rte_node(x) && x.type === "embed" && is_bool(x.internal) && is_string(x.target)

export const is_ordo_rte_header_node = (x: any): x is TOrdoRTEHeaderNode =>
	is_ordo_rte_parent(x) && x.type === "h" && [1, 2, 3, 4, 5, 6].includes(x.level as any)
