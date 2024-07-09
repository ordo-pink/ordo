import { checkAll, isNonEmptyString, isNonNegativeFiniteInteger, isUUID } from "@ordo-pink/tau"

import { type FSID } from "./data.types"
import { type TMetadata } from "./metadata.types"

export const areLabels = (labels: string[]) => checkAll(isLabel, labels)

export const areLinks = (links: FSID[]) => checkAll(isLink, links)

export const isName = (name: string) => isNonEmptyString(name)

export const isSize = (size: number) => isNonNegativeFiniteInteger(size)

export const isType = (type: string) => isNonEmptyString(type) // TODO: MIME-TYPE

// TODO: Avoid handling invalid arguments
export const isHidden = (item: TMetadata) =>
	item && item.getName && typeof item.getName === "function" && item.getName().startsWith(".")

export const hasAllLabels = (labels: string[]) => (item: TMetadata) =>
	labels.every(label => item.getLabels().includes(label))

export const isParent = (parent: FSID | null) => parent === null || isUUID(parent)

export const isLabel = isNonEmptyString

export const isLink = isUUID
