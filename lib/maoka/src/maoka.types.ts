/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { HTML_TAGS } from "./html-tags"

export namespace Maoka {
	export namespace Context {
		export type Create = <$Value>() => Maoka.Context.Instance<$Value>

		export type Instance<$Value> = {
			consume: Maoka.Jab<$Value>
			provide: (value: $Value) => Maoka.Jab
		}
	}

	export namespace Guards {
		export type IsNode<$Value = unknown> = (x: any) => x is Maoka.Node<$Value>
		export type IsComponent = (x: any) => x is Maoka.Component

		export type Module = {
			node: Maoka.Guards.IsNode
			component: Maoka.Guards.IsComponent
		}
	}

	export type Id = string | number

	export type Node<$Value = unknown> = {
		id: Maoka.Id
		kindergarten: Maoka.Kindergarten | void
		root: Maoka.Root<$Value>
		value: $Value
	}

	export type Child = null | void | string | number | Maoka.Node | Maoka.Component

	export type Children = Child | Child[]

	export type Jab<$Return = void> = (args: Maoka.Args) => $Return

	export type Use = <$Return = void>(jab: Maoka.Jab<$Return>) => $Return

	export type Kindergarten = () => Maoka.Children | Promise<Maoka.Children>

	export type CreateId = () => Maoka.Id

	export type CreateValue<$Value = unknown> = (tag: string) => $Value

	export type BaseArgs = Record<string, unknown> & {
		kindergarten?: Maoka.Kindergarten
	}

	export type Args<$Args extends Maoka.BaseArgs | void = void> = $Args extends void
		? {
				use: Maoka.Use
				node: Maoka.Node
				kindergarten?: Kindergarten
			}
		: $Args & {
				use: Maoka.Use
				node: Maoka.Node
				kindergarten?: Kindergarten
			}

	export type Fn<$Args extends Maoka.BaseArgs | void = void> = (
		args: Maoka.Args<$Args>,
	) => Kindergarten | Promise<Kindergarten> | void

	export type Root<$Value = unknown> = {
		id: Maoka.Id
		create_id: Maoka.CreateId
		create_value: Maoka.CreateValue<$Value>
	}

	export type Component = (root: Maoka.Root) => Maoka.Node | Promise<Maoka.Node>

	export type CreateComponent = <$Args extends Maoka.BaseArgs | void = void>(
		tag: string,
		f: Maoka.Fn<Args<$Args>>,
	) => (args: $Args | Maoka.Kindergarten) => Maoka.Component

	export type Tags = Record<(typeof HTML_TAGS)[number], (f: Maoka.Fn) => Maoka.Component>

	export type Module = {
		context: Maoka.Context.Create
		create: Maoka.CreateComponent
		guards: Maoka.Guards.Module
	}
}

export namespace MaokaDOM {
	export type Render = (element: HTMLElement, component: Maoka.Component, create_id: () => Maoka.Id) => Promise<void>

	export type OnMountHandler = (() => void) | (() => () => void)

	export type OnUnmountHandler = () => void

	export namespace Jabs {
		export type IfDOM = <$Element extends HTMLElement = HTMLElement, $Return = void>(
			f: (element: MaokaDOM.Node<$Element>) => $Return,
		) => Maoka.Jab<$Return | void>

		export type OnMount = (f: (node: MaokaDOM.Node) => void | (() => void)) => Maoka.Jab

		export type OnUnmount = (f: (node: MaokaDOM.Node) => void) => Maoka.Jab

		export type Refresh$ = Maoka.Jab

		export type Static = {
			if_dom: MaokaDOM.Jabs.IfDOM
			onmount: MaokaDOM.Jabs.OnMount
			onunmount: MaokaDOM.Jabs.OnUnmount
			refresh$: MaokaDOM.Jabs.Refresh$
		}
	}

	export namespace Guards {
		export type IsNode = <$Value = unknown>(x: any) => x is Maoka.Node<$Value>
		export type IsComponent = (x: any) => x is Maoka.Component
		export type IsDOMNode<$Element extends HTMLElement = HTMLElement> = (x: any) => x is MaokaDOM.Node<$Element>

		export type Static = {
			dom_node: MaokaDOM.Guards.IsDOMNode
		}
	}

	export type Node<$Element extends HTMLElement = HTMLElement> = Maoka.Node<
		$Element & {
			mounted?: boolean
			onmount?: OnMountHandler[]
			onunmount?: OnUnmountHandler[]
		}
	>

	export type Root<$Element extends HTMLElement = HTMLElement> = Maoka.Root<$Element> & {
		refresh_queue: MaokaDOM.Node[]
	}

	export type Module = {
		guards: MaokaDOM.Guards.Static
		jabs: MaokaDOM.Jabs.Static
		render: MaokaDOM.Render
	}
}
