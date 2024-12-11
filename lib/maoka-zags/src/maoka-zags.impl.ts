/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TZags, ZAGS } from "@ordo-pink/zags"
import { type TMaokaJab } from "@ordo-pink/maoka"

// TODO Merging in external zags
export const MaokaZAGS = {
	Of: <T extends Record<string, unknown>>(initial_state: T) => {
		const zags = ZAGS.Of(initial_state)

		return {
			select$: maoka_zags_select_jab(zags),
			update: maoka_zags_update(zags),
		}
	},
}

export const maoka_zags_update =
	<T extends Record<string, unknown>>(zags: TZags<T>) =>
	<K extends string>(path: K, value: FromDotPath<T, K>) => {
		const state = { ...zags.unwrap() }
		const keys = path.split(".")

		const location = keys.slice(0, -1).reduce((acc, key) => (acc as any)[key], state)

		if ((location as any)[keys[keys.length - 1]] !== value) {
			;(location as any)[keys[keys.length - 1]] = value
			zags.update(state)
		}
	}

// TODO Cache selection
export const maoka_zags_select_jab =
	<T extends Record<string, unknown>>(zags: TZags<T>) =>
	<K>(selector: (state: T) => K): TMaokaJab<() => K> =>
	({ refresh }) => {
		let result: K
		let is_initial_render = true

		zags.marry(state => {
			result = selector(state)

			if (is_initial_render) {
				is_initial_render = false
				return
			}

			void refresh()
		})

		return () => result!
	}

/**
 * Borrowed from https://gist.github.com/j1mmie/03e1dfc7ca14296604843235ad32082a
 */

type CombineAll<T> = T extends { [name in keyof T]: infer Type } ? Type : never

type PropertyNameMap<T, IncludeIntermediate extends boolean> = {
	[name in keyof T]: T[name] extends Record<string, unknown>
		? SubPathsOf<name, T, IncludeIntermediate> | (IncludeIntermediate extends true ? name : never)
		: name
}

type SubPathsOf<
	key extends keyof T,
	T,
	IncludeIntermediate extends boolean,
> = `${string & key}.${string & TDotPath<T[key], IncludeIntermediate>}`

type FromDotPath<T extends Record<string, unknown>, K extends string> = K extends `${infer U}.${infer N}`
	? T[U] extends Record<string, unknown>
		? FromDotPath<T[U], N>
		: never
	: T[K]

/**
 * Extracts out the keys of the given type as dot separated paths.
 * For example:
 * {
 *   key1: string;
 *   key2: {
 *      sub1: string;
 *      sub2: string
 *   }
 * }
 *
 * Will be extracted as:
 *   'key1' | 'key2.sub1' | 'key2.sub2'
 *
 * If you provide a value of `true` for the IncludeIntermediate parameter, then it will
 * also include the object keys by themselves:
 *   'key1' | 'key2' | 'key2.sub1' | 'key2.sub2'
 *
 * This works to any depth, so you can have objects within objects, within objects, etc.
 *
 * NOTE: You cannot have circular types in this. ie. A child key cannot reference its own
 * type or a parent type.
 */
export type TDotPath<T, IncludeIntermediate extends boolean = true> = CombineAll<PropertyNameMap<T, IncludeIntermediate>>
