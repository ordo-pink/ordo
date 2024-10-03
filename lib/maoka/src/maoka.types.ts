// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// TODO: Comments
// TODO: Full types
export type TMaokaElement = { [$TKey in keyof HTMLElement]: HTMLElement[$TKey] | undefined } & {
	setAttribute: (qualified_name: string, value: string) => void
	getAttribute: (qualified_name: string) => string
	appendChild: (child: TMaokaChild) => TMaokaChild
	replaceChildren: (...children: TMaokaChild[]) => void
	childNodes: HTMLElement["childNodes"]
	onunmount: (() => void)[] | undefined
}

export type TMaokaTextElement = Partial<{ [$TKey in keyof Text]: Text[$TKey] }> | string

export type TMaokaCreateMaokaElementFn<$TElement extends TMaokaElement = TMaokaElement> = (
	name: string,
) => $TElement

export type TMaokaCreateComponentFn = (name: string, callback: TMaokaCallback) => TMaokaComponent

export type TMaokaComponent<$TElement extends TMaokaElement = TMaokaElement> = (
	create_element: TMaokaCreateMaokaElementFn<$TElement>,
	root_element: TMaokaElement,
	root_id: string,
) => Promise<TMaokaElement>

export type TMaokaHook<$TReturn = void> = (props: TMaokaProps) => $TReturn

/**
 * A Maoka component child. If the child is a Maoka component function, it will be called using the
 * same context as the parent Maoka component. If the child is a string, it will be rendered as
 * inner text of the parent. If the child is an HTML element, it will be appended to the parent. If
 * the child is undefined, it will not be rendered as a child but the changes made with the hooks
 * will be applied.
 */
export type TMaokaChild =
	| TMaokaElement
	| TMaokaComponent
	| string
	| number
	| undefined
	| null
	| void

/**
 * TChildren is an expected return type of a Maoka callback.
 *
 * @see TMaokaChild
 */
export type TMaokaChildren = TMaokaChild | TMaokaChild[]

/**
 * A record of hooks that are provided by Maoka directly.
 */
export type TMaokaProps<$TElement extends TMaokaElement = TMaokaElement> = {
	/**
	 * Get UUID of current Maoka component. This would probably only be useful for creating custom
	 * hooks that accumulate a set of components to apply batch refresh calls. You would hardly ever
	 * need this in your application code.
	 */
	get id(): string

	/**
	 * Returns reference to the current element.
	 */
	get element(): $TElement

	/**
	 * Root id.
	 */
	get root_id(): string

	get root_element(): TMaokaElement

	/**
	 * Trigger refreshing current Maoka component. Technically, calling refresh is basically calling
	 * the Maoka component callback function in which this `refresh` function is available inside
	 * `use` parameter.
	 */
	refresh: () => Promise<void>

	on_unmount: TMaokaOnUnmountFn

	use: <_TResult>(hook: TMaokaHook<_TResult>) => _TResult
}

export type TMaokaOnUnmountFn = (f: () => void) => void

/**
 * A callback function that returns children of the current Maoka component. It accepts a record of
 * hooks available within the execution context of current Maoka root. If the callback does not
 * return, the Maoka component will be rendered without children.
 *
 * @see TMaokaChildren
 */
export type TMaokaCallback = (
	props: TMaokaProps,
) =>
	| ((() => TMaokaChildren) | undefined | void)
	| ((() => Promise<TMaokaChildren>) | undefined | void)
	| Promise<(() => TMaokaChildren) | undefined | void>
	| Promise<(() => Promise<TMaokaChildren>) | undefined | void>

export type TMaokaRenderDOMFn = <$TElement extends HTMLElement = HTMLElement>(
	root: $TElement,
	component: TMaokaComponent,
) => Promise<void>
