// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// TODO: Comments
// TODO: Intermediate types for HTMLElement and Text
// TODO: Full types
export type TAttributes<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	unsafe_inner_html?: string
	style?: string
	class?: string
	onclick?: (event: MouseEvent) => void
}

export type TChild<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> =
	| HTMLElement
	| string
	| void
	| ((
			create_element: (name: string) => HTMLElement,
			create_text: (text: string) => Text,
			custom_hooks: TInitHook<$TCustomHooks>,
	  ) => HTMLElement)

export type TChildren<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> =
	| TChild<$TCustomHooks>
	| TChild<$TCustomHooks>[]

export type TExtractCallbackHooks<$TFn> = $TFn extends TCreateComponentFn<infer U> ? U : never

type TNoSpace<$TStr extends string> = $TStr extends `${string} ${string}` ? never : $TStr

export type THooks<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = {
	refresh: () => void
	remove: () => void
	get_internal_id: () => string
	on_mount: (callback: () => void) => void
	on_refresh: (callback: () => void) => void | (() => void)
	get_current_element: <T extends HTMLElement = HTMLElement>() => T
	set_attribute: (key: string, value: string) => void
	set_class: (...classes: string[]) => void
	add_class: (...classes: string[]) => void
	remove_class: (...classes: string[]) => void
	replace_class: <$TPrevious extends string, $TNext extends string>(
		previous: TNoSpace<$TPrevious>,
		next: TNoSpace<$TNext>,
	) => void
	set_style: (style: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>) => void
	set_inner_html: (html: string) => void
	set_listener: <K extends keyof HTMLElement>(
		key: K extends `on${string}` ? K : never,
		value: HTMLElement[K],
	) => void
} & $TCustomHooks

export type TCallback<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = (
	use: THooks<$TCustomHooks>,
) => TChildren<$TCustomHooks>

export type TMaokaConfig<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> =
	{
		create_element: (type: string) => HTMLElement
		create_text: (value: string) => Text
		hooks?: TInitHook<$TCustomHooks>
	}

export type TInitHook<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = {
	[K in keyof $TCustomHooks]: (use: THooks) => $TCustomHooks[K]
}

export type TCreateComponentFn<
	$TCustomHooks extends Record<string, unknown> = Record<string, unknown>,
> = (
	name: string,
	attributes: TAttributes,
	callback?: TCallback<$TCustomHooks>,
) => () => HTMLElement
