import { UUIDv4 } from "@ordo-pink/tau"

export namespace User {
	export type Handle = `@${string}`

	export namespace Current {
		export type Email = `${string}@${string}.${string}`

		export type DTO = Core.DTO<
			[...Core.Identifiable.DTO<UUIDv4>, ...Core.Timestampable.DTO<UUIDv4>, handle: User.Handle, emails: User.Current.Email[]]
		>

		export type Instance = Core.Identifiable.Instance<UUIDv4> &
			Core.Transferable.Instance<User.Current.DTO> &
			Core.Timestampable.Instance<Core.UUIDv4>

		export type Static = Core.Identifiable.Static<UUIDv4> &
			Core.Timestampable.Static &
			Core.Creatable.Static<[email: User.Current.Email], User.Current.Instance>
	}
}

export namespace Core {
	export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}` & NonNullable<unknown>

	export type DTO<$DTO extends any[]> = [...$DTO]

	export namespace Creatable {
		export type Static<$Params extends unknown[], $Instance> = {
			new: (...params: $Params) => $Instance
		}
	}

	export namespace Timestampable {
		export type DTO<$Id = string> = [created_at: number, created_by: $Id, updated_at: number, updated_by: $Id]

		export type Instance<$Id = string> = {
			get_created_at: () => Date
			get_created_by: () => $Id
			is_created_after: (date: Date) => boolean
			is_created_before: (date: Date) => boolean
			is_created_by: (id: $Id) => boolean
			get_updated_at: () => Date
			get_updated_by: () => $Id
			is_updated_after: (date: Date) => boolean
			is_updated_before: (date: Date) => boolean
			is_updated_by: (id: $Id) => boolean
		}

		export type Static = {
			create_timestamp: () => number
		}
	}

	export namespace Identifiable {
		export type DTO<$Type = string> = [id: $Type]

		export type Instance<$Type = string> = {
			get_id: () => $Type
			has_id: (id: $Type) => boolean
		}

		export type Static<$Type = string> = {
			is_id: (id: $Type) => boolean
			create_id: () => $Type
		}
	}

	export namespace Transferable {
		export type Instance<$DTO extends unknown[]> = {
			to_dto: () => Core.DTO<$DTO>
		}

		export type Static<$Instance, $DTO extends unknown[]> = {
			from_dto: (dto: $DTO) => $Instance
		}
	}
}
