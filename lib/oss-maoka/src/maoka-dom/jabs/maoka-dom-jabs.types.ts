import type * as Maoka from "../../maoka/maoka.types.ts"
import type { Node } from "../maoka-dom.types.ts"

export type HitIfDom = <$Element extends HTMLElement = HTMLElement, $Return = void>(
	f: (node: Node<$Element>) => $Return,
) => Maoka.Jab<$Return | void>

export type OnUnmount = (f: (node: Node) => void) => Maoka.Jab

export type OnMount = (f: (node: Node) => void | OnUnmount) => Maoka.Jab

export type Refresh$ = Maoka.Jab
