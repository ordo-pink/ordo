// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// TODO: Comments
// TODO: Full types
export type TMaokaElement = { [$TKey in keyof HTMLElement]: HTMLElement[$TKey] } & {
	setAttribute: (...params: Parameters<HTMLElement["setAttribute"]>) => void
	appendChild: (child: TMaokaElement | string) => void
	onunmount: (() => void)[] | undefined
}

export type TMaokaText = Partial<{ [$TKey in keyof Text]: Text[$TKey] }> | string

export type TMaokaCreateComponentFn = (callback?: TMaokaCallback) => TMaokaCreateComponentImplFn

export type TMaokaCreateComponentImplFn<
	$TElement extends TMaokaElement = TMaokaElement,
	$TText extends TMaokaText = TMaokaText,
> = (
	create_element: (name: string) => $TElement,
	create_text: (text: string) => $TText,
	root_id: string,
) => HTMLElement

export type TMaokaHook<T = void> = (props: TMaokaProps) => T

/**
 * A Maoka component child. If the child is a Maoka component function, it will be called using the
 * same context as the parent Maoka component. If the child is a string, it will be rendered as
 * inner text of the parent. If the child is an HTML element, it will be appended to the parent. If
 * the child is undefined, it will not be rendered as a child but the changes made with the hooks
 * will be applied.
 */
export type TMaokaChild =
	| SVGSVGElement
	| HTMLElement
	| string
	| undefined
	| void
	| TMaokaCreateComponentImplFn

/**
 * TChildren is an expected return type of a Maoka callback.
 *
 * @see TMaokaChild
 */
export type TMaokaChildren = TMaokaChild | TMaokaChild[]

/**
 * Supplementary type that checks whether provided string does not contain spaces.
 */
export type TNoSpace<$TStr extends string> = $TStr extends `${string} ${string}` ? never : $TStr

/**
 * A record of hooks that are provided by Maoka directly.
 */
export type TMaokaProps<$TElement extends TMaokaElement = TMaokaElement> = {
	/**
	 * Get UUID of current Maoka component. This would probably only be useful for creating custom
	 * hooks that accumulate a set of components to apply batch refresh calls. You would hardly ever
	 * need this in your application code.
	 */
	get internal_id(): string

	/**
	 * Returns reference to the current element.
	 */
	get current_element(): $TElement

	get root_id(): string

	/**
	 * Trigger refreshing current Maoka component. Technically, calling refresh is basically calling
	 * the Maoka component callback function in which this `refresh` function is available inside
	 * `use` parameter.
	 */
	refresh: () => void

	on_unmount: TMaokaOnUnountFn

	on_refresh: TMaokaOnRefreshFn

	use: <_TResult>(hook: (ctx: TMaokaProps) => _TResult) => _TResult
}

export type TMaokaOnUnountFn = (f: () => void) => void

export type TMaokaOnRefreshFn = (f: () => boolean | void) => void

/**
 * A callback function that returns children of the current Maoka component. It accepts a record of
 * hooks available within the execution context of current Maoka root. If the callback does not
 * return, the Maoka component will be rendered without children.
 *
 * @see TMaokaChildren
 */
export type TMaokaCallback = (props: TMaokaProps) => (() => TMaokaChildren) | undefined | void

export type TMaokaRenderDOMFn = (root: HTMLElement, component: TMaokaCreateComponentImplFn) => void
