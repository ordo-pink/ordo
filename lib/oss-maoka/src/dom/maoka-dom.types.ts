/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "../maoka.types.ts"

export * from "./jabs/maoka-jabs.types.ts"

export * as Jabs from "./jabs/maoka-jabs.types.ts"

/** Maoka DOM renderer. */
export type DomRender = (
	/** HTML element to render to. */
	element: HTMLElement,
	/** Top level component to be rendered. */
	component: Maoka.Component,
	/** Maoka {@link Maoka.Id id} creator. */
	create_id: Maoka.CreateId,
) => Promise<void>

/** Calls back when component mounts to the DOM. Components may have multiple `OnMountHandler`s. */
export type DomOnMountHandler = () => void | Promise<void> | DomOnUnmountHandler | Promise<DomOnUnmountHandler>

/** Calls back when component unmounts from the DOM. Components may have multiple `OnUnmountHandler`s. */
export type DomOnUnmountHandler = () => void | Promise<void>

/** DOM node type guard. Only returns `true` if node was created by maoka with `maoka_dom` renderer. */
export type DomNodeGuard<$Element extends HTMLElement = HTMLElement> = (x: any) => x is DomNode<$Element>

/** Maoka DOM node. Has `HTMLElement` as a value. */
export type DomNode<$Element extends HTMLElement = HTMLElement> = Maoka.Node<DomNodeValue<$Element>>

/** Maoka-patched DOM element. */
export type DomNodeValue<$Element extends HTMLElement = HTMLElement> = $Element & {
	mounted?: boolean
	onmount?: DomOnMountHandler[]
	onunmount?: DomOnUnmountHandler[]
}

/** Maoka DOM root. Just like an ordinary Maoka root, but also has a refresh queue. */
export type DomRoot<$Element extends HTMLElement = HTMLElement> = Maoka.Root<DomNodeValue<$Element>> & {
	refresh_queue: DomNode[]
}
