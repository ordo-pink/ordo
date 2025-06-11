/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CoreSDK {
	export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

	export type VersionState = { version: number }

	export type TrackUpdates = "with_updates" | "without_updates"

	export type Prettify<$Type> = {
		[$Key in keyof $Type]: $Type[$Key] extends Record<string, unknown> ? CoreSDK.Prettify<$Type[$Key]> : $Type[$Key]
	} & {}

	export type BaseInterface = { Plain: {}; Instance: {}; Validations: {}; Static: {} }

	export type Mixin<$Interface extends CoreSDK.BaseInterface> = {
		instance: (
			plain: CoreSDK.Prettify<$Interface["Plain"]>,
		) => CoreSDK.Prettify<{ [_Key in keyof $Interface["Instance"]]: $Interface["Instance"][_Key] }>
		static: $Interface["Static"]
		validations: $Interface["Validations"]
	}

	export type Impl<$Interface extends BaseInterface> = CoreSDK.Prettify<
		$Interface["Static"] & { validations: $Interface["Validations"] }
	>

	export type MixInterfaces<$Interfaces extends Mixin<any>[]> = $Interfaces extends [CoreSDK.Mixin<infer _First>, ...infer _Rest]
		? _Rest extends []
			? _First
			: _Rest extends CoreSDK.Mixin<any>[]
				? _First & CoreSDK.MixInterfaces<_Rest>
				: never
		: never

	export type Mix = <$Mixins extends CoreSDK.Mixin<any>[]>(...mixins: $Mixins) => CoreSDK.Impl<CoreSDK.MixInterfaces<$Mixins>>

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
