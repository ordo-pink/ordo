import { is_finite_non_negative_int, is_positive_number } from "../../validations.impl"
import type { Core } from "../../sdk-core.types"

export namespace space_limited {
	export const DEFAULT_FILE_LIMIT = 1000

	export const DEFAULT_FILE_SIZE_LIMIT = 1.5

	export const mixin: Core.Mixin<SpaceLimited.Interface> = {
		instance: ({ file_limit, file_size_limit }) => ({
			can_create_file: length => length < file_limit,
			can_upload_file: size => size < file_size_limit,
			get_file_limit: () => file_limit,
			get_file_size_limit: () => file_size_limit,
			get_files_left: length => length - file_limit,
		}),
		static: {
			get_default_file_limit: () => DEFAULT_FILE_LIMIT,
			get_default_file_size_limit: () => DEFAULT_FILE_SIZE_LIMIT,
		},
		validations: {
			is_file_limit: is_finite_non_negative_int,
			is_file_size_limit: is_positive_number,
		},
	}
}

export namespace SpaceLimited {
	export type FileLimit = number & {}
	export type FileSizeLimit = number & {}

	export type DTO = [file_limit: FileLimit, file_size_limit: FileSizeLimit]

	export type Interface = {
		Instance: {
			can_create_file: (current_length: number) => boolean
			can_upload_file: (size: number) => boolean
			get_file_limit: () => FileLimit
			get_file_size_limit: () => FileSizeLimit
			get_files_left: (current_length: number) => number
		}
		Plain: {
			file_limit: FileLimit
			file_size_limit: FileSizeLimit
		}
		Static: {
			get_default_file_limit: () => FileLimit
			get_default_file_size_limit: () => FileSizeLimit
		}
		Validations: {
			is_file_limit: (x: any) => x is FileLimit
			is_file_size_limit: (x: any) => x is FileSizeLimit
		}
	}
}
