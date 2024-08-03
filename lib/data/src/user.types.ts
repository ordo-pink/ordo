import { TValidations } from "@ordo-pink/tau"

export type TPublicUserValidations = TValidations<TPublicUserDTO>

export type TUserValidations = TValidations<TUserDTO>

export type UserID = `${string}-${string}-${string}-${string}-${string}`

export type TUserHandle = `@${string}`

export type TEmail = `${string}@${string}.${string}`

export type TPublicUserDTO = {
	created_at: Date
	handle: `@${string}`
	subscription: string
}

export type TUserDTO = TPublicUserDTO & {
	email_confirmed: boolean
	email: `${string}@${string}`
	file_limit: number
	first_name: string
	id: UserID
	last_name: string
	max_functions: number
	max_upload_size: number
}

export type TPublicUserStatic = {
	FromDTO: (user: User.PublicUser) => TPublicUser
	Validations: TPublicUserValidations
}

export type TUserStatic = {
	FromDTO: (user: User.User) => TUser
	Validations: TUserValidations
}

export type TPublicUser = {
	get_created_at: () => Date
	get_handle: () => TUserHandle
	get_subscription: () => string
}

export type TUser = TPublicUser & {
	get_email: () => string
	get_file_limit: () => number
	get_first_name: () => string
	get_full_name: () => string
	get_id: () => UserID
	get_last_name: () => string
	get_max_functions: () => number
	get_max_upload_size: () => number
	is_email_confirmed: () => boolean
}
