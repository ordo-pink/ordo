import { HTML_TAGS } from "./html-tags"

export namespace Maoka {
	export namespace Context {
		export type Create = <$Value>() => Maoka.Context.Instance<$Value>

		export type Instance<$Value> = {
			consume: Maoka.Jab<$Value>
			provide: (value: $Value) => Maoka.Jab
		}
	}

	export namespace DOM {
		export type Render = (element: HTMLElement, component: Maoka.Component, create_id: () => Maoka.Id) => Promise<void>

		export type OnMountHandler = (() => void) | (() => () => void)

		export type OnUnmountHandler = () => void

		export type Node<$Element extends HTMLElement = HTMLElement> = Maoka.Node<
			$Element & {
				mounted?: boolean
				onmount?: OnMountHandler[]
				onunmount?: OnUnmountHandler[]
			}
		>

		export type Root<$Element extends HTMLElement = HTMLElement> = Maoka.Root<$Element> & {
			refresh_queue: Maoka.DOM.Node[]
		}

		export type Static = {
			render: Maoka.DOM.Render
		}
	}

	export namespace Guards {
		export type IsNode = <$Value = unknown>(x: any) => x is Maoka.Node<$Value>
		export type IsComponent = (x: any) => x is Maoka.Component
		export type IsDOMNode<$Element extends HTMLElement = HTMLElement> = (x: any) => x is Maoka.DOM.Node<$Element>

		export type Static = {
			node: Maoka.Guards.IsNode
			component: Maoka.Guards.IsComponent
			dom_node: Maoka.Guards.IsDOMNode
		}
	}

	export namespace Jabs {
		export type IfDOM = <$Element extends HTMLElement = HTMLElement, $Return = void>(
			f: (element: Maoka.DOM.Node<$Element>) => $Return,
		) => Maoka.Jab<$Return | void>

		export type OnMount = (f: Maoka.DOM.OnMountHandler) => Maoka.Jab

		export type OnUnmount = (f: Maoka.DOM.OnUnmountHandler) => Maoka.Jab

		export type Refresh$ = Maoka.Jab

		export type Static = {
			if_dom: Maoka.Jabs.IfDOM
			onmount: Maoka.Jabs.OnMount
			onunmount: Maoka.Jabs.OnUnmount
			refresh$: Maoka.Jabs.Refresh$
		}
	}

	export type Id = string | number

	export type Node<$Value = unknown> = {
		id: Maoka.Id
		kindergarten: Maoka.Kindergarten<$Value> | void
		root: Maoka.Root<$Value>
		value: $Value
	}

	export type Teacher<$Params = void> = $Params extends void
		? (kindergarten: Maoka.Kindergarten) => Maoka.Component
		: (params: $Params, kindergarten: Maoka.Kindergarten) => Maoka.Component

	export type Child<$Value = unknown> = null | void | string | number | Maoka.Node<$Value> | Maoka.Component

	export type Children<$Value = unknown> = Child<$Value> | Child<$Value>[]

	export type Jab<$Return = void> = <$Value = unknown>(use: Maoka.Use, node: Maoka.Node<$Value>) => $Return

	export type Use = <$Return = void>(jab: Maoka.Jab<$Return>) => $Return

	export type Kindergarten<$Value = unknown> = () => Maoka.Children<$Value> | Promise<Maoka.Children<$Value>>

	export type CreateId = () => Maoka.Id

	export type CreateValue<$Value = unknown> = (tag: string) => $Value

	export type Fn<$Value = unknown> = (
		use: Maoka.Use,
		node: Maoka.Node<$Value>,
	) => Kindergarten<$Value> | Promise<Kindergarten<$Value>> | void

	export type Root<$Value = unknown> = {
		id: Maoka.Id
		create_id: Maoka.CreateId
		create_value: Maoka.CreateValue<$Value>
	}

	export type Component = <$Value = unknown>(root: Maoka.Root<$Value>) => Maoka.Node<$Value> | Promise<Maoka.Node<$Value>>

	export type CreateComponent<$Value = unknown> = (
		tag: string,
		f?: Maoka.Fn<$Value>,
	) => typeof f extends undefined ? (f: Maoka.Fn<$Value>) => Maoka.Component : Maoka.Component

	export type Tags = Record<(typeof HTML_TAGS)[number], (f: Maoka.Fn) => Maoka.Component>

	export type Styled<$Value = unknown> = Record<
		(typeof HTML_TAGS)[number],
		(classes: string) => (f: Maoka.Fn<$Value>) => Maoka.Component
	>

	export type Module = {
		context: Maoka.Context.Create
		create: Maoka.CreateComponent
		dom: Maoka.DOM.Static
		guards: Maoka.Guards.Static
		jabs: Maoka.Jabs.Static
		styled: Maoka.Styled
	}
}
