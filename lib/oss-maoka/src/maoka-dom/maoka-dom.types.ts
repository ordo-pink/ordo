import type * as Maoka from "../maoka/maoka.types.ts"

export type * as Jabs from "./jabs/maoka-dom-jabs.types.ts"

/** Maoka DOM renderer. */
export type Render = (
	/** HTML element to render to. */
	element: HTMLElement,
	/** Top level component to be rendered. */
	component: Maoka.Component,
	/** Maoka {@link Maoka.Id id} creator. */
	create_id: Maoka.CreateId,
) => Promise<void>

/** Calls back when component mounts to the DOM. Components may have multiple `OnMountHandler`s. */
export type OnMountHandler = (() => void) | (() => OnUnmountHandler)

/** Calls back when component unmounts from the DOM. Components may have multiple `OnUnmountHandler`s. */
export type OnUnmountHandler = () => void

/** DOM node type guard. Only returns `true` if node was created by maoka with `maoka_dom` renderer. */
export type NodeGuard<$Element extends HTMLElement = HTMLElement> = (x: any) => x is Node<$Element>

/** Maoka DOM node. Has `HTMLElement` as a value. */
export type Node<$Element extends HTMLElement = HTMLElement> = Maoka.Node<NodeValue<$Element>>

/** Maoka-patched DOM element. */
export type NodeValue<$Element extends HTMLElement = HTMLElement> = $Element & {
	mounted?: boolean
	onmount?: OnMountHandler[]
	onunmount?: OnUnmountHandler[]
}

/** Maoka DOM root. Just like an ordinary Maoka root, but also has a refresh queue. */
export type Root<$Element extends HTMLElement = HTMLElement> = Maoka.Root<NodeValue<$Element>> & {
	refresh_queue: Node[]
}
