import { checkAll, isNonEmptyString, isNonNegativeFiniteInteger, isUUID } from "@ordo-pink/tau"

import { type FSID } from "./data.types"
import { type TMetadata } from "./metadata.types"

export const areValidLabels = (labels: string[]) => checkAll(isNonEmptyString, labels)

export const areValidLinks = (links: FSID[]) => checkAll(isUUID, links)

export const isName = (name: string) => isNonEmptyString(name)

export const isValidSize = (size: number) => isNonNegativeFiniteInteger(size)

export const isType = (type: string) => isNonEmptyString(type) // TODO: MIME-TYPE

// TODO: Avoid handling invalid arguments
export const isHidden = (item: TMetadata) =>
	item && item.getName && typeof item.getName === "function" && item.getName().startsWith(".")

export const hasAllLabels = (labels: string[]) => (item: TMetadata) =>
	labels.every(label => item.getLabels().includes(label))

export const isValidParent = (parent: FSID | null) => parent === null || isUUID(parent)
