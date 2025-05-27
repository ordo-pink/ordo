/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Core {
	export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

	export namespace SemVer {
		export type Major = `${number}` & {}
		export type Minor = `${number}` & {}
		export type Patch = `${number}` & {}
		export type Build = string & {}
		export type PreRelease = string & {}
		export type Version =
			| `${Major}.${Minor}.${Patch}`
			| `${Major}.${Minor}.${Patch}+${Build}`
			| `${Major}.${Minor}.${Patch}-${PreRelease}`
			| `${Major}.${Minor}.${Patch}-${PreRelease}+${Build}`
	}

	export type NonNegative<$Number extends number> = `${$Number}` extends `-${number}` ? never : $Number

	export namespace Util {
		export type Prettify<$Type> = { [$Key in keyof $Type]: $Type[$Key] } & {}
	}

	export namespace Model {
		export type DTO<$Content extends any[]> = [...$Content]

		export type Instance<$Content extends {}> = Core.Util.Prettify<$Content>

		export type Static<
			$Content extends {},
			$Validations extends Record<`is_${string}`, (x: any) => boolean>,
		> = Core.Util.Prettify<$Content & { validations: Core.Util.Prettify<$Validations> }>

		export namespace Identifiable {
			export type ID = Core.UUIDv4 & {}

			export type DTO = [id: ID]

			export type Instance = {
				get_id: () => ID
			}

			export type Validations = {
				is_id: (x: any) => x is ID
			}

			export type Static = {
				create_id: () => ID
			}
		}

		export namespace Transferable {
			export type Instance<$DTO extends any[]> = {
				to_dto: () => $DTO
			}

			export type Validations<$DTO extends any[]> = {
				is_dto: (x: any) => x is $DTO
			}

			export type Static<$DTO extends any[], $Instance extends {}> = {
				from_dto: (dto: $DTO) => $Instance
			}
		}

		export namespace TimeTrackable {
			export type Timestamp = number & {}

			export type CreateTracker = {
				get_created_at: () => Date
				get_raw_created_at: () => Timestamp
				is_created_after: (date: Date, exclude_exact_match?: boolean) => boolean
				is_created_before: (date: Date, exclude_exact_match?: boolean) => boolean
			}

			export type UpdateTracker = {
				get_raw_updated_at: () => Timestamp
				get_updated_at: () => Date
				is_updated_after: (date: Date, exclude_exact_match?: boolean) => boolean
				is_updated_before: (date: Date, exclude_exact_match?: boolean) => boolean
			}

			export type DTO<$TrackUpdates extends boolean> = $TrackUpdates extends true
				? [created_at: Timestamp, updated_at: Timestamp]
				: [created_at: Timestamp]

			export type Instance<$TrackUpdates extends boolean> = $TrackUpdates extends true
				? CreateTracker & UpdateTracker
				: CreateTracker

			export type Validations = {
				is_timestamp: (x: any) => x is Timestamp
			}

			export type Static = {
				create_timestamp: () => Timestamp
			}
		}

		export namespace AuthorTrackable {
			export type Author = Identifiable.ID

			export type CreateTracker = {
				get_created_by: () => Author
				is_created_by: (id: Author) => boolean
			}

			export type UpdateTracker = {
				get_updated_by: () => Author
				is_updated_by: (id: Author) => boolean
			}

			export type DTO<$TrackUpdates extends boolean> = $TrackUpdates extends true
				? [created_by: Author, updated_by: Author]
				: [created_by: Author]

			export type Instance<$TrackUpdates extends boolean> = $TrackUpdates extends true
				? CreateTracker & UpdateTracker
				: CreateTracker

			export type Validations = {
				is_id: (x: any) => x is Author
			}
		}

		export namespace Creatable {
			export type Static<$Params extends any[], $Instance extends {}> = {
				create: (...params: $Params) => $Instance
			}
		}
	}
}
