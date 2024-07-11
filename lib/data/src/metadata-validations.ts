import { checkAll, isNonEmptyString, isNonNegativeFiniteInteger, isUUID } from "@ordo-pink/tau"

import { type FSID } from "./data.types"
import { type TMetadata } from "./metadata.types"

export const are_lbls = (lbls: string[]) => checkAll(is_lbl, lbls)

export const are_lnks = (links: FSID[]) => checkAll(is_lnk, links)

export const is_prop_key = (key: string | number | symbol) => isNonEmptyString(key)

export const is_name = (name: string) => isNonEmptyString(name)

export const is_size = (size: number) => isNonNegativeFiniteInteger(size)

export const is_type = (type: string) => isNonEmptyString(type) // TODO: MIME-TYPE

// TODO: Avoid handling invalid arguments
export const is_hidden = (item: TMetadata) =>
	item && item.get_name && typeof item.get_name === "function" && item.get_name().startsWith(".")

export const has_all_lbls = (lbls: string[]) => (item: TMetadata) =>
	lbls.every(label => item.get_labels().includes(label))

export const is_parent = (parent: FSID | null) => parent === null || isUUID(parent)

export const is_lbl = isNonEmptyString

export const is_lnk = isUUID
