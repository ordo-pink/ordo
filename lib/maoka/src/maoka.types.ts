/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// TODO: Comments
// TODO: Full types
export type TMaokaElement = Pick<
	Element,
	"setAttribute" | "getAttribute" | "appendChild" | "replaceChildren" | "dispatchEvent" | "addEventListener" | "children"
>

export type TCreateIDFn = () => string

export type TMaokaRootElement<$TElement = TMaokaElement> = {
	create_id: TCreateIDFn
	create_element: TMaokaCreateMaokaElementFn
	refresh_queue: Map<string, { element: TMaokaElement; render: () => Promise<TMaokaElement> }>

	get id(): string
	get element(): $TElement
}

export type TMaokaCreateMaokaElementFn = (name: string) => TMaokaElement

export type TMaokaCreateComponentFn = (name: string, callback: TMaokaCallback) => TMaokaComponent

export type TMaokaComponent = {
	(root: TMaokaRootElement): Promise<TMaokaElement>
	id?: string
	element?: TMaokaElement
	refresh?: () => void
}

export type TMaokaJab<$TReturn = void> = (props: TMaokaProps) => $TReturn

/**
 * A Maoka component child. If the child is a Maoka component function, it will be called using the
 * same context as the parent Maoka component. If the child is a string, it will be rendered as
 * inner text of the parent. If the child is an HTML element, it will be appended to the parent. If
 * the child is undefined, it will not be rendered as a child but the changes made with the jabs
 * will be applied.
 */
export type TMaokaChild = TMaokaElement | TMaokaComponent | string | number | undefined | null | void

/**
 * TChildren is an expected return type of a Maoka callback.
 *
 * @see TMaokaChild
 */
export type TMaokaChildren = TMaokaChild | TMaokaChild[]

/**
 * A record of jabs that are provided by Maoka directly.
 */
export type TMaokaProps = {
	/**
	 * Get UUID of current Maoka component. This would probably only be useful for creating custom
	 * jabs that accumulate a set of components to apply batch refresh calls. You would hardly ever
	 * need this in your application code.
	 */
	get id(): string

	/**
	 * Returns reference to the current element.
	 */
	get element(): TMaokaElement

	get root(): TMaokaRootElement

	/**
	 * Trigger refreshing current Maoka component. Technically, calling refresh is basically calling
	 * the Maoka component callback function in which this `refresh` function is available inside
	 * `use` parameter.
	 */
	refresh: () => void

	use: <_TResult>(jab: TMaokaJab<_TResult>) => _TResult
}

/**
 * A callback function that returns children of the current Maoka component. It accepts a record of
 * jabs available within the execution context of current Maoka root. If the callback does not
 * return, the Maoka component will be rendered without children.
 *
 * @see TMaokaChildren
 */
export type TMaokaCallback = (
	props: TMaokaProps,
) =>
	| void
	| undefined
	| null
	| (() => TMaokaChildren)
	| (() => Promise<TMaokaChildren>)
	| Promise<() => TMaokaChildren>
	| Promise<() => Promise<TMaokaChildren>>
