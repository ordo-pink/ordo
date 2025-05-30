/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Core {
	export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

	export type Prettify<$Type> = {
		[$Key in keyof $Type]: $Type[$Key] extends Record<string, unknown> ? Prettify<$Type[$Key]> : $Type[$Key]
	} & {}

	export type BaseInterface = { Plain: {}; Instance: {}; Validations: {}; Static: {} }

	export type Mixin<$Interface extends BaseInterface> = {
		instance: (
			plain: Prettify<$Interface["Plain"]>,
		) => Prettify<{ [_Key in keyof $Interface["Instance"]]: $Interface["Instance"][_Key] }>
		static: $Interface["Static"]
		validations: $Interface["Validations"]
	}

	export type Impl<$Interface extends BaseInterface> = Prettify<
		$Interface["Static"] & { validations: $Interface["Validations"] }
	>

	export type MixInterfaces<$Interfaces extends Mixin<any>[]> = $Interfaces extends [Mixin<infer _First>, ...infer _Rest]
		? _Rest extends []
			? _First
			: _Rest extends Mixin<any>[]
				? _First & MixInterfaces<_Rest>
				: never
		: never

	export type Mix = <$Mixins extends Core.Mixin<any>[]>(...mixins: $Mixins) => Impl<MixInterfaces<$Mixins>>
}
