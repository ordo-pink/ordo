/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Hunt {
	export type Preys<$Preys extends Record<string, unknown>> = Hunt.Pouch.RecordToKeyValue<
		Hunt.Pouch.KeyValueToFlatRecord<$Preys>
	>

	export type Prey<$Preys extends Record<string, unknown>> = keyof Preys<$Preys>

	export type BlankShot<$Preys extends Record<string, unknown>, $Prey extends Hunt.Prey<$Preys> = Hunt.Prey<$Preys>> = {
		prey: $Prey
	}

	export type LoadedShot<
		$Preys extends Record<string, unknown>,
		$Prey extends Hunt.Prey<$Preys> = Hunt.Prey<$Preys>,
		$Bullet = any,
	> = Hunt.BlankShot<$Preys, $Prey> & {
		bullet: $Bullet
	}

	export type Shot<$Preys extends Record<string, unknown>> = BlankShot<$Preys> | LoadedShot<$Preys>

	export type Gun<$Bullet> = (bullet: $Bullet) => void

	export type GunFor<$Preys extends Record<string, unknown>, $Prey extends Hunt.Prey<$Preys>> = Gun<Hunt.Preys<$Preys>[$Prey]>

	export type Shoot<$Preys extends Record<string, unknown>> = <$Prey extends Hunt.Prey<$Preys>>(
		prey: $Prey,
		...rest: Hunt.Preys<$Preys>[$Prey] extends void ? [undefined] : [bullet: Hunt.Preys<$Preys>[$Prey]]
	) => void

	export type Track<$Preys extends Record<string, unknown>> = <$Prey extends Hunt.Prey<$Preys>>(
		prey: $Prey,
		gun: Gun<Hunt.Preys<$Preys>[$Prey]>,
	) => void

	export type PutDown<$Preys extends Record<string, unknown>> = <$Prey extends Hunt.Prey<$Preys>>(
		prey: $Prey,
		gun: Gun<Hunt.Preys<$Preys>[$Prey]>,
	) => void

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

	export type State<$Preys extends Record<string, unknown>> = {
		barrage: Hunt.Shot<$Preys>[]
		gun_storage: Record<string, Hunt.Gun<any>[]>
	}

	export type Module = {
		begin: <$Preys extends Record<string, unknown>>() => {
			track: Hunt.Track<$Preys>
			shoot: Hunt.Shoot<$Preys>
			putdown: Hunt.PutDown<$Preys>
		}
	}
}
