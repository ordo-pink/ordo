/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Core {
	export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

	export type VersionState = { version: number }

	export type TrackUpdates = "with_updates" | "without_updates"

	export type Prettify<$Type> = {
		[$Key in keyof $Type]: $Type[$Key] extends Record<string, unknown> ? Core.Prettify<$Type[$Key]> : $Type[$Key]
	} & {}

	export type BaseInterface = { Plain: {}; Instance: {}; Validations: {}; Static: {} }

	export type Mixin<$Interface extends Core.BaseInterface> = {
		instance: (
			plain: Core.Prettify<$Interface["Plain"]>,
		) => Core.Prettify<{ [_Key in keyof $Interface["Instance"]]: $Interface["Instance"][_Key] }>
		static: $Interface["Static"]
		validations: $Interface["Validations"]
	}

	export type Impl<$Interface extends BaseInterface> = Core.Prettify<
		$Interface["Static"] & { validations: $Interface["Validations"] }
	>

	export type MixInterfaces<$Interfaces extends Mixin<any>[]> = $Interfaces extends [Core.Mixin<infer _First>, ...infer _Rest]
		? _Rest extends []
			? _First
			: _Rest extends Core.Mixin<any>[]
				? _First & Core.MixInterfaces<_Rest>
				: never
		: never

	export type Mix = <$Mixins extends Core.Mixin<any>[]>(...mixins: $Mixins) => Core.Impl<Core.MixInterfaces<$Mixins>>

	/**
	 * Ordo backend hostnames.
	 */
	export type Hosts = {
		/**
		 * AU is Ordo authentication server.
		 *
		 * @constant - Should never be overriden. If you want a fully self-hosted instance, reach out our
		 * enter_price team for help at {@link "hello@ordo.pink"}.
		 */
		au: string

		/**
		 * FN is Ordo FStore.
		 *
		 * @constant - Should never be overriden to avoid big trouble. If you want custom Fs that do not reside in
		 * the FStore, use sideloading.
		 */
		fn: string

		/**
		 * ID provides access to user info including current user info, access to public ifo about other users,
		 * access permissions and user groups (for teams/enter_price).
		 *
		 * @constant - Should never be overriden. If you want a fully self-hosted instance, reach out our
		 * enter_price team for help at {@link "hello@ordo.pink"}.
		 */
		id: string

		/**
		 * DT is global data backup instance. Additional backup hosts are stored on the user entity.
		 *
		 * @constant - Should never be overriden. If you want to enable backup self-hosting, you should go to
		 * backup persistence section of your account settings. Global backups can be disabled there as well.
		 */
		dt: string

		/**
		 * PB provides access to publicly shared files via readable URLs.
		 *
		 * @variable - Should be replaced if you self-host public sharing.
		 */
		pb: string

		/**
		 * WEB host where the app is currently served.
		 *
		 * @variable - Should be replaced if you self-host the client app.
		 */
		web: string
	}
}
