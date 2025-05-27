import type { Core } from "./core.types"
import type { user } from "./user.impl"

export namespace User {
	export type ID = Core.Model.Identifiable.ID

	export namespace Referrable {
		export type Handle = `@${string}` & {}

		export type DTO = [handle: Handle]

		export type Instance = {
			get_handle: () => Handle
		}

		export type Validations = {
			is_handle: (x: any) => x is Handle
		}

		export type Static = {
			create_handle: (email: Receptive.Email, id: ID) => Handle
		}
	}

	export namespace Payable {
		export type DTO = [subscription: user.SUBSCRIPTION]

		export type Instance = {
			get_subscription: () => user.SUBSCRIPTION
			has_paid_subscription: () => boolean
		}

		export type Validations = {
			is_subscription: (x: any) => x is user.SUBSCRIPTION
		}
	}

	export namespace Named {
		export type FirstName = string & {}
		export type LastName = string & {}

		export type DTO = [first_name: FirstName, last_name: LastName]

		export type Instance = {
			get_first_name: () => FirstName
			get_last_name: () => LastName
			get_full_name: () => string
		}

		export type Validations = {
			is_name: (x: any) => x is FirstName & LastName
		}
	}

	export namespace Receptive {
		export type Email = `${string}@${string}.${string}` & {}

		export type DTO = [email: Email]

		export type Instance = {
			get_email: () => Email
		}

		export type Validations = {
			is_email: (x: any) => x is Email
		}
	}

	export namespace UIExtendable {
		export type InstallableFunctionName = string & {}
		export type InstallableFunction = `${InstallableFunctionName}@${Core.SemVer.Version}` & {}
		export type InstalledFunctions = InstallableFunction[]

		export type DTO = [installed_fns: InstalledFunctions]

		export type Instance = {
			get installed_fns_length(): number
			get_installed_fns: () => InstalledFunctions
			has_installed_fns: () => boolean
		}

		export type Validations = {
			is_installable_function: (x: any) => x is InstallableFunction
		}
	}

	export namespace Limited {
		export type FileLimit = number & {}

		export type FnLimit = number & {}
		export type FileSizeLimit = number & {}

		export type DTO = [file_limit: FileLimit, fn_limit: FnLimit, file_size_limit: FileSizeLimit]

		export type Instance = {
			can_create_file: (current_length: number) => boolean
			can_install_fns: () => boolean
			can_upload_file: (size: number) => boolean
			get_file_limit: () => FileLimit
			get_file_size_limit: () => FileSizeLimit
			get_files_left: (current_length: number) => number
			get_fn_limit: () => FnLimit
		}

		export type Validations = {
			is_file_limit: (x: any) => x is FileLimit
			is_file_size_limit: (x: any) => x is FileSizeLimit
			is_fn_limit: (x: any) => x is FnLimit
		}
	}

	export namespace Authenticatable {
		export type DeviceInfo = `${string} ${string} (${string})` & {}
		export type Session = [id: ID, timestamp: Core.Model.TimeTrackable.Timestamp, device_info: DeviceInfo]

		export type DTO = [sessions: Session[]]

		export type Instance = {
			get sessions_length(): number
			get_sessions: () => Session[]
			has_session: (id: ID) => boolean
			get_session_device_info: (id: ID) => DeviceInfo | null
		}

		export type Validations = {
			is_session: (x: any) => x is Session
			is_id: (x: any) => x is ID
			is_timestamp: (x: any) => x is Core.Model.TimeTrackable.Timestamp
		}

		export type Static = {
			create_session: (device_info: DeviceInfo) => Session
		}
	}

	export namespace Common {
		export type DTO = [
			...Core.Model.Identifiable.DTO,
			...Core.Model.TimeTrackable.DTO<false>,
			...Referrable.DTO,
			...Payable.DTO,
			...Named.DTO,
		]

		export type Instance = Core.Model.Instance<
			Core.Model.Identifiable.Instance &
				Core.Model.TimeTrackable.Instance<false> &
				Referrable.Instance &
				Payable.Instance &
				Named.Instance
		>

		export type Validations = Core.Util.Prettify<
			Core.Model.Identifiable.Validations &
				Core.Model.TimeTrackable.Validations &
				Referrable.Validations &
				Payable.Validations &
				Named.Validations
		>

		export type Static = Core.Model.Static<Core.Model.Identifiable.Static & Core.Model.TimeTrackable.Static, Validations>
	}

	export namespace Other {
		export type DTO = Common.DTO & {}

		export type Instance = Core.Model.Instance<Common.Instance & Core.Model.Transferable.Instance<DTO>>

		export type Validations = Core.Util.Prettify<Common.Validations & Core.Model.Transferable.Validations<DTO>>

		export type Static = Core.Model.Static<Common.Static & Core.Model.Transferable.Static<DTO, Instance>, Validations>
	}

	export namespace Current {
		export type CreateParams = [email: Receptive.Email]

		export type DTO = [...Common.DTO, ...Receptive.DTO, ...UIExtendable.DTO, ...Limited.DTO, ...Authenticatable.DTO]

		export type Instance = Core.Model.Instance<
			Common.Instance &
				Receptive.Instance &
				Limited.Instance &
				UIExtendable.Instance &
				Authenticatable.Instance &
				Core.Model.Transferable.Instance<DTO>
		>

		export type Validations = Core.Util.Prettify<
			Common.Validations &
				Receptive.Validations &
				UIExtendable.Validations &
				Limited.Validations &
				Authenticatable.Validations &
				Core.Model.Transferable.Validations<DTO>
		>

		export type Static = Core.Model.Static<
			Core.Model.Creatable.Static<CreateParams, Instance> &
				Authenticatable.Static &
				Common.Static &
				Referrable.Static &
				Core.Model.Transferable.Static<DTO, Instance>,
			Validations
		>
	}
}
