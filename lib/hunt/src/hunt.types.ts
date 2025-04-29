/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/**
 * DISCLAIMER: We are not responsible for injuries inflicted by the use of guns other than low-energy photon dispencers.
 */
export namespace Hunt {
	export type BasePreys = Record<string, unknown>

	/**
	 * Hunt command payload. Mostly used for internal purposes.
	 */
	export type Shot<$Preys extends Hunt.BasePreys, $Prey extends keyof $Preys = keyof $Preys, $Bullet = any> = {
		bullet: $Bullet
		prey: $Prey
		callback: (error?: unknown) => Promise<void>
	}

	/**
	 * Command handler.
	 */
	export type Gun<$Bullet> = (
		/**
		 * Payload of the command expected based on the provided Preys.
		 */
		bullet: $Bullet,
	) => void | Promise<void>

	/**
	 * Helper type that will provide inference for your function arguments if you provide the command name (a.k.a. prey).
	 *
	 * @example
	 * ```typescript
	 * import { Hunt, hunt } from "@ordo-pink/hunt"
	 *
	 * type DeerName = string
	 * type Prey = { deer: { args: DeerName } }
	 *
	 * const hunter = hunt.begin<Prey>()
	 * const deer_gun: Hunt.GunFor<Prey, "deer"> = name => console.log(name)
	 * hunter.track("deer", deer_gun)
	 * ```
	 */
	export type GunFor<$Preys extends Hunt.BasePreys, $Prey extends keyof $Preys> = Gun<$Preys[$Prey]>

	/**
	 * Shoot the prey with provided bullet. The bullet will be provided as payload to the gun you assigned via tracking
	 * the prey. If the prey is not tracked, the bullet will wait for the gun to be assigned and then fire immediately
	 * as soon as you start tracking.
	 *
	 * @example
	 * ```typescript
	 * import { hunt } from "@ordo-pink/hunt"
	 *
	 * type Prey = { deer: { args: { name: string } } }
	 *
	 * const hunter = hunt.begin<Prey>()
	 * hunter.track("deer", console.log)
	 * hunter.shoot("deer", { name: "Dancer" }) // { name: "Dancer" }
	 * ```
	 */
	export type Shoot<$Preys extends Hunt.BasePreys> = <$Prey extends keyof $Preys>(
		/**
		 * Prey to shoot.
		 */
		prey: $Prey,

		/**
		 * Payload to be provided to the gun.
		 */
		bullet: $Preys[$Prey],
	) => {
		/**
		 * Turn into promise that resolves if the shot succeeds or rejects if the shot fails. Useful in case you
		 * need to guarantee subsequent shots.
		 */
		to_promise: () => Promise<void>
	}

	/**
	 * Track given prey for shots. Preys may be tracked multiple times.
	 *
	 * @returns unsubscribe function to stop tracking.
	 *
	 * @example
	 * ```typescript
	 * import { hunt } from "@ordo-pink/hunt"
	 *
	 * type Prey = { deer: { args: string } }
	 *
	 * const hunter = hunt.begin<Prey>()
	 *
	 * hunter.shoot("deer", "Dancer")
	 * hunter.shoot("deer", "Rudolph")
	 *
	 * hunter.track("deer", console.log)
	 * // "Dancer"
	 * // "Rudolph"
	 *
	 * hunter.shoot("deer", "Dasher") // "Dasher"
	 * ```
	 */
	export type Track<$Preys extends Hunt.BasePreys> = <$Prey extends keyof $Preys>(
		/**
		 * Prey to track.
		 */
		prey: $Prey,

		/**
		 * Gun to use against the prey. Accepts the bullet provided to `shoot`.
		 */
		gun: Gun<$Preys[$Prey]>,
	) => () => void

	/**
	 * Internal hunt state.
	 */
	export type State<$Preys extends Hunt.BasePreys> = {
		barrage: Hunt.Shot<$Preys>[]
		gun_storage: Record<string, Hunt.Gun<any>[]>
	}

	/**
	 * Creates an isolated hunt. Accepts optional $Preys type that should be a (optionally) nested object that has leaves
	 * represented with objects of the structure `{ args: T }`. The `T` of the `args` will be inferred as a type of the
	 * bullet when you shoot. The nested path will be turned into a dot-separated string path.
	 *
	 * NOTE: You can omit providing $Preys. Then the prey autocompletion will not suggest options, and the bullet type
	 * inference will not work. You will have to provide some bullet when you shoot, even if you don't need one.
	 *
	 * Let the hunt begin!
	 */
	export type Begin = <$Preys extends Record<string, unknown> = Record<string, { args: any }>>() => {
		/** @see {@link Hunt.Track} */
		track: Hunt.Track<Hunt.Pouch.ToPreys<$Preys>>
		/** @see {@link Hunt.Shoot} */
		shoot: Hunt.Shoot<Hunt.Pouch.ToPreys<$Preys>>
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
	 * 	// To provide the expected command payload, wrap it { args: %PAYLOAD_TYPE% }
	 * 	replace_str: { args: string }
	 * 	// The keys can be nested, which will create dot-separated command names ("maths.add_one")
	 * 	maths: {
	 * 		// If you want the command to have no payload, assign args to be `void`
	 * 		add_one: { args: void }
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
	 * const putdown = hunter.track("maths.add_one", () => num++)
	 * hunter.track("replace_str", new_str => void (str = new_str))
	 *
	 * // Call the commands
	 * hunter.shoot("maths.add_one")
	 * hunter.shoot("maths.add_one")
	 *
	 * putdown()
	 *
	 * hunter.shoot("maths.add_one") // Ignored since tracking ended
	 *
	 * hunter.shoot("replace_str", "Goodbye, world")
	 *
	 * // Check the result
	 * console.log(num) // 2
	 * console.log(str) // "Goodbye, world"
	 *
	 * hunter.track("maths.add_one", () => num++)
	 *
	 * // The ignored shot is now applied since tracking was reenabled
	 * console.log(num) // 3
	 * ```
	 * @module
	 */
	export type Module = {
		/** @see {@link Hunt.Begin} */
		begin: Hunt.Begin
	}

	/**
	 * A bag with useful tools.
	 * @namespace
	 */
	export namespace Pouch {
		/**
		 * Transform provided deeply nested object into a flat record with dot-separated keys.
		 */
		export type ToPreys<$Preys extends Record<string, unknown>> = Hunt.Pouch.KeyValueToRecord<Hunt.Pouch.ToFlatRecord<$Preys>>

		/**
		 * Transform key-value pair to Record<key, value>.
		 */
		export type KeyValueToRecord<$Record extends { key: string; value: any }> = {
			[$Key in $Record["key"]]: Extract<$Record, { key: $Key }>["value"]
		}

		/**
		 * Transform nested object with `{ args: T }` leaves to Record<path, T> where path is dot-separated key in the
		 * provided nested object.
		 */
		export type ToFlatRecord<
			$Record extends object,
			$Prefix extends string | null = null,
			$Key extends keyof $Record = keyof $Record,
		> = $Prefix extends null
			? $Key extends string
				? $Record[$Key] extends { args: infer _Args }
					? { key: $Key; value: _Args }
					: $Record[$Key] extends object
						? ToFlatRecord<$Record[$Key], $Key, keyof $Record[$Key]>
						: never
				: never
			: $Key extends string
				? $Record[$Key] extends { args: infer _Args }
					? { key: `${$Prefix}.${$Key}`; value: _Args }
					: $Record[$Key] extends object
						? ToFlatRecord<$Record[$Key], `${$Prefix}.${$Key}`, keyof $Record[$Key]>
						: never
				: never
	}
}
