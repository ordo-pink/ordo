import { Element } from "slate"
import { OrdoElement } from "../editor.types"

export const isOrdoElement = (x: any): x is OrdoElement =>
	!!x && x.type && typeof x.type === "string" && Element.isElement(x)
