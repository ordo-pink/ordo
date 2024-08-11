// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export type TAttributes<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	unsafe_inner_html?: string
	style?: string
	class?: string
	onclick?: (event: MouseEvent) => void
}

export type TChild = () => HTMLElement | string
export type TChildren = TChild | TChild[] | ReturnType<TChild> | ReturnType<TChild>[]

export type TExtractCallbackHooks<$TFn> = $TFn extends TCreateComponentFn<infer U> ? U : never

export type THooks<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = {
	refresh: () => void
	remove: () => void
	id: () => string
	on_mount: (callback: () => void) => void
	on_refresh: (callback: () => void) => void | (() => void)
	current_element: <T extends HTMLElement = HTMLElement>() => T
} & $TCustomHooks

export type TCallback<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>> = (
	use: THooks<$TCustomHooks>,
) => TChildren

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
