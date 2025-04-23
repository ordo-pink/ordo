/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface HuntPreys {}
}

export namespace Hunt {
	export type Preys = Hunt.Pouch.RecordToKeyValue<Hunt.Pouch.KeyValueToFlatRecord<HuntPreys>>

	export type Prey = keyof Preys

	export type BlankShot<$Prey extends Hunt.Prey = Hunt.Prey> = { prey: $Prey }

	export type LoadedShot<$Prey extends Hunt.Prey = Hunt.Prey, $Bullet = any> = Hunt.BlankShot<$Prey> & {
		bullet: $Bullet
	}

	export type Shot = BlankShot | LoadedShot

	export type Gun<$Bullet> = (bullet: $Bullet) => void

	export type GunFor<$Prey extends Hunt.Prey> = Gun<Hunt.Preys[$Prey]>

	export type Shoot = <$Prey extends Hunt.Prey>(
		prey: $Prey,
		...rest: Hunt.Preys[$Prey] extends void ? [undefined] : [bullet: Hunt.Preys[$Prey]]
	) => void

	export type Track = <$Prey extends Hunt.Prey>(prey: $Prey, gun: Gun<Hunt.Preys[$Prey]>) => void

	export type PutDown = <$Prey extends Hunt.Prey>(prey: $Prey, gun: Gun<Hunt.Preys[$Prey]>) => void

	export namespace Pouch {
		export type RecordToKeyValue<$Record extends { key: string; value: any }> = {
			[$Key in $Record["key"]]: Extract<$Record, { key: $Key }>["value"]
		}

		export type KeyValueToFlatRecord<
			$Record extends object,
			$Prefix extends string | null = null,
			$Key extends keyof $Record = keyof $Record,
		> = $Prefix extends null
			? $Key extends string
				? $Record[$Key] extends () => infer V
					? { key: $Key; value: V }
					: $Record[$Key] extends object
						? KeyValueToFlatRecord<$Record[$Key], $Key, keyof $Record[$Key]>
						: never
				: never
			: $Key extends string
				? $Record[$Key] extends () => infer V
					? { key: `${$Prefix}.${$Key}`; value: V }
					: $Record[$Key] extends object
						? KeyValueToFlatRecord<$Record[$Key], `${$Prefix}.${$Key}`, keyof $Record[$Key]>
						: never
				: never
	}

	export type Module = {
		begin: () => {
			track: Hunt.Track
			shoot: Hunt.Shoot
			putdown: Hunt.PutDown
		}
	}
}
