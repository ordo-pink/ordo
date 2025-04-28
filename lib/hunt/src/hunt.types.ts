/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Hunt {
	export type Shot<
		$Preys extends Record<string, unknown>,
		$Prey extends Hunt.Pouch.Prey<$Preys> = Hunt.Pouch.Prey<$Preys>,
		$Bullet = any,
	> = { bullet: $Bullet; prey: $Prey; callback: (error?: unknown) => Promise<void> }

	export type Gun<$Bullet> = (bullet: $Bullet) => void | Promise<void>

	export type GunFor<$Preys extends Record<string, unknown>, $Prey extends Hunt.Pouch.Prey<$Preys>> = Gun<
		Hunt.Pouch.ToPreys<$Preys>[$Prey]
	>

	export type Shoot<$Preys extends Record<string, unknown>> = <$Prey extends Hunt.Pouch.Prey<$Preys>>(
		prey: $Prey,
		bullet: Hunt.Pouch.ToPreys<$Preys>[$Prey],
	) => () => Promise<void>

	export type Track<$Preys extends Record<string, unknown>> = <$Prey extends Hunt.Pouch.Prey<$Preys>>(
		prey: $Prey,
		gun: Gun<Hunt.Pouch.ToPreys<$Preys>[$Prey]>,
	) => () => void

	export namespace Pouch {
		export type ToPreys<$Preys extends Record<string, unknown>> = Hunt.Pouch.RecordToKeyValue<
			Hunt.Pouch.KeyValueToFlatRecord<$Preys>
		>

		export type Prey<$Preys extends Record<string, unknown>> = keyof ToPreys<$Preys>

		export type RecordToKeyValue<$Record extends { key: string; value: any }> = {
			[$Key in $Record["key"]]: Extract<$Record, { key: $Key }>["value"]
		}

		export type KeyValueToFlatRecord<
			$Record extends object,
			$Prefix extends string | null = null,
			$Key extends keyof $Record = keyof $Record,
		> = $Prefix extends null
			? $Key extends string
				? $Record[$Key] extends { args: infer _Args }
					? { key: $Key; value: _Args }
					: $Record[$Key] extends object
						? KeyValueToFlatRecord<$Record[$Key], $Key, keyof $Record[$Key]>
						: never
				: never
			: $Key extends string
				? $Record[$Key] extends { args: infer _Args }
					? { key: `${$Prefix}.${$Key}`; value: _Args }
					: $Record[$Key] extends object
						? KeyValueToFlatRecord<$Record[$Key], `${$Prefix}.${$Key}`, keyof $Record[$Key]>
						: never
				: never
	}

	export type State<$Preys extends Record<string, unknown>> = {
		barrage: Hunt.Shot<$Preys>[]
		gun_storage: Record<string, Hunt.Gun<any>[]>
	}

	export type Begin = <$Preys extends Record<string, unknown>>() => {
		track: Hunt.Track<$Preys>
		shoot: Hunt.Shoot<$Preys>
	}

	/**
	 * # @ordo-pink/hunt
	 *
	 * [![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
	 *
	 * > Let the hunt begin.
	 *
	 * Hunt is command manager for implementing your own ~~S.P.Q.R.~~ CQRS.
	 *
	 * ## Getting Started
	 *
	 * ```typescript
	 * import { hunt } from "@ordo-pink/hunt"
	 *
	 * type Preys = {
	 * 	// The key becomes the command name
	 * 	// To provide the expected command payload, wrap it with a thunk
	 * 	replace_str: () => string
	 * 	// The keys can be nested, which will create dot-separated command names ("maths.add_one")
	 * 	maths: {
	 * 		// If you want the command to have no payload, return a thunk that returns `void`
	 * 		add_one: () => void
	 * 	}
	 * }
	 *
	 * // Let the hunt begin
	 * const hunter = hunt.begin<Preys>()
	 *
	 * let num = 0
	 * let str = "Hello, world"
	 *
	 * // Register handlers for commands
	 * // Every command may have multiple handlers
	 * // When the command is emitted, they will be called in the order they were registered.
	 * hunter.track("maths.add_one", () => num++)
	 * hunter.track("replace_str", new_str => void (str = new_str))
	 *
	 * // Call the commands
	 * hunter.shoot("maths.add_one")
	 * hunter.shoot("maths.add_one")
	 * hunter.shoot("maths.add_one")
	 * hunter.shoot("replace_str", "Goodbye, world")
	 *
	 * // Check the result
	 * console.log(num) // 3
	 * console.log(str) // "Goodbye, world"
	 * ```
	 * @module
	 */
	export type Module = {
		/** @see {@link Hunt.Begin} */
		begin: Hunt.Begin
	}
}
