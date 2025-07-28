export type Prettify<$Type> = { [$Key in keyof $Type]: $Type[$Key] } & {}

export type GenericGuard<$T> = (x: any) => x is $T

/**
 * Logger definition in accordance with {@link https://www.rfc-editor.org/rfc/rfc5424 RFC5424}.
 */
export type Logger = {
	/** Severity Level 0: Emergency: system is unusable. */
	panic: (...message: any[]) => void

	/** Severity Level 1: Alert: action must be taken immediately. */
	alert: (...message: any[]) => void

	/** Severity Level 2: Critical: critical conditions. */
	crit: (...message: any[]) => void

	/** Severity Level 3: Error: error conditions. */
	error: (...message: any[]) => void

	/** Severity Level 4: Warning: warning conditions. */
	warn: (...message: any[]) => void

	/** Severity level 5: Notice: normal but significant condition. */
	notice: (...message: any[]) => void

	/** Severity level 6: Informational: informational messages. */
	info: (...message: any[]) => void

	/** Severity level 7: Debug: debug-level messages. */
	debug: (...message: any[]) => void
}

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
