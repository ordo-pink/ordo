import isEmail from "validator/lib/isEmail"

import * as TAU from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"

import { UserSubscription } from "../constants"

const can_user_add_function = (dto: Ordo.User.Current.DTO) => () =>
	dto.installed_functions.length < dto.max_functions

const can_user_create_files = (dto: Ordo.User.Current.DTO) => (files: number) =>
	files < dto.file_limit

const can_user_upload = (dto: Ordo.User.Current.DTO) => (bytes: number) =>
	bytes <= dto.max_upload_size

const get_user_created_at = (dto: Ordo.User.Public.DTO) => () => new Date(dto.created_at)

const get_user_email = (dto: Ordo.User.Current.DTO) => () => dto.email

const get_user_file_limit = (dto: Ordo.User.Current.DTO) => () => dto.file_limit

const get_user_first_name = (dto: Ordo.User.Public.DTO) => () => dto.first_name ?? ""

const get_user_full_name = (dto: Ordo.User.Public.DTO) => () =>
	Switch.OfTrue()
		.case(!!dto.first_name && !!dto.last_name, () => `${dto.first_name} ${dto.last_name}`)
		.case(!!dto.first_name, () => dto.first_name!)
		.default(() => dto.last_name!)

const get_user_readable_name = (dto: Ordo.User.Public.DTO) => () =>
	get_user_full_name(dto)() ?? dto.handle.slice(1)

const get_user_handle = (dto: Ordo.User.Public.DTO) => () => dto.handle

const get_user_id = (dto: Ordo.User.Public.DTO) => () => dto.id

const get_user_installed_functions = (dto: Ordo.User.Current.DTO) => () => dto.installed_functions

const get_user_last_name = (dto: Ordo.User.Public.DTO) => () => dto.last_name ?? ""

const get_user_max_functions = (dto: Ordo.User.Current.DTO) => () => dto.max_functions

const get_user_max_upload_size = (dto: Ordo.User.Current.DTO) => () => dto.max_upload_size

const get_user_subscription = (dto: Ordo.User.Public.DTO) => () => dto.subscription

const is_user_email_confirmed = (dto: Ordo.User.Current.DTO) => () => dto.email_confirmed

const is_user_newer_than = (dto: Ordo.User.Public.DTO) => (date: Date) =>
	get_user_created_at(dto)() < date

const is_user_older_than = (dto: Ordo.User.Public.DTO) => (date: Date) =>
	get_user_created_at(dto)() > date

const is_user_subscription_paid = (dto: Ordo.User.Public.DTO) => () =>
	dto.subscription > UserSubscription.FREE

export const CurrentUserValidations: Ordo.User.Current.Validations = {
	is_created_at: (x): x is Ordo.User.Current.DTO["created_at"] => TAU.is_date(x),
	is_first_name: (x): x is Ordo.User.Current.DTO["first_name"] =>
		TAU.is_undefined(x) || TAU.is_string(x),
	is_handle: (x): x is Ordo.User.Current.DTO["handle"] =>
		TAU.is_non_empty_string(x) && x.startsWith("@"),
	is_id: (x): x is Ordo.User.Current.DTO["id"] => TAU.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Current.DTO["last_name"] =>
		TAU.is_undefined(x) || TAU.is_string(x),
	is_subscription: (x): x is Ordo.User.Current.DTO["subscription"] =>
		TAU.is_number(x) && TAU.gte(0)(x) && TAU.lt(UserSubscription.length)(x),
	is_email: (x): x is Ordo.User.Current.DTO["email"] => TAU.is_non_empty_string(x) && isEmail(x),
	is_email_confirmed: (x): x is Ordo.User.Current.DTO["email_confirmed"] => TAU.is_bool(x),
	is_file_limit: (x): x is Ordo.User.Current.DTO["file_limit"] => TAU.is_positive_number(x),
	is_installed_functions: (x): x is Ordo.User.Current.DTO["installed_functions"] =>
		TAU.is_array(x) && TAU.check_all(TAU.is_non_empty_string, x),
	is_max_functions: (x): x is Ordo.User.Current.DTO["max_functions"] =>
		TAU.is_finite_non_negative_int(x),
	is_max_upload_size: (x): x is Ordo.User.Current.DTO["max_upload_size"] =>
		TAU.is_non_negative_number(x),
	is_dto: (x): x is Ordo.User.Current.DTO => {
		const y = x as Ordo.User.Current.DTO

		return (
			TAU.is_object(y) &&
			CurrentUser.Validations.is_created_at(y.created_at) &&
			CurrentUser.Validations.is_first_name(y.first_name) &&
			CurrentUser.Validations.is_handle(y.handle) &&
			CurrentUser.Validations.is_id(y.id) &&
			CurrentUser.Validations.is_last_name(y.last_name) &&
			CurrentUser.Validations.is_subscription(y.subscription) &&
			CurrentUser.Validations.is_email(y.email) &&
			CurrentUser.Validations.is_email_confirmed(y.email_confirmed) &&
			CurrentUser.Validations.is_file_limit(y.file_limit) &&
			CurrentUser.Validations.is_installed_functions(y.installed_functions) &&
			CurrentUser.Validations.is_max_functions(y.max_functions) &&
			CurrentUser.Validations.is_max_upload_size(y.max_upload_size)
		)
	},
}

export const CurrentUser: Ordo.User.Current.Static = {
	Validations: CurrentUserValidations,
	FromDTO: dto => ({
		can_add_function: can_user_add_function(dto),
		can_create_files: can_user_create_files(dto),
		can_upload: can_user_upload(dto),
		get_created_at: get_user_created_at(dto),
		get_email: get_user_email(dto),
		get_file_limit: get_user_file_limit(dto),
		get_first_name: get_user_first_name(dto),
		get_full_name: get_user_full_name(dto),
		get_handle: get_user_handle(dto),
		get_id: get_user_id(dto),
		get_installed_functions: get_user_installed_functions(dto),
		get_last_name: get_user_last_name(dto),
		get_max_functions: get_user_max_functions(dto),
		get_max_upload_size: get_user_max_upload_size(dto),
		get_readable_name: get_user_readable_name(dto),
		get_subscription: get_user_subscription(dto),
		is_email_confirmed: is_user_email_confirmed(dto),
		is_newer_than: is_user_newer_than(dto),
		is_older_than: is_user_older_than(dto),
		is_paid: is_user_subscription_paid(dto),
		to_dto: () => dto,
	}),
}

export const PublicUserValidations: Ordo.User.Public.Validations = {
	is_created_at: (x): x is Ordo.User.Public.DTO["created_at"] => TAU.is_date(x),
	is_first_name: (x): x is Ordo.User.Public.DTO["first_name"] =>
		TAU.is_undefined(x) || TAU.is_string(x),
	is_handle: (x): x is Ordo.User.Public.DTO["handle"] =>
		TAU.is_non_empty_string(x) && x.startsWith("@"),
	is_id: (x): x is Ordo.User.Public.DTO["id"] => TAU.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Public.DTO["last_name"] =>
		TAU.is_undefined(x) || TAU.is_string(x),
	is_subscription: (x): x is Ordo.User.Public.DTO["subscription"] =>
		TAU.is_number(x) && TAU.gte(0)(x) && TAU.lt(UserSubscription.length)(x),
	is_dto: (x): x is Ordo.User.Public.DTO => {
		const y = x as Ordo.User.Public.DTO

		return (
			TAU.is_object(y) &&
			PublicUser.Validations.is_created_at(y.created_at) &&
			PublicUser.Validations.is_first_name(y.first_name) &&
			PublicUser.Validations.is_handle(y.handle) &&
			PublicUser.Validations.is_id(y.id) &&
			PublicUser.Validations.is_last_name(y.last_name) &&
			PublicUser.Validations.is_subscription(y.subscription)
		)
	},
}

export const PublicUser: Ordo.User.Public.Static = {
	Validations: PublicUserValidations,
	FromDTO: dto => ({
		get_created_at: get_user_created_at(dto),
		get_first_name: get_user_first_name(dto),
		get_full_name: get_user_full_name(dto),
		get_handle: get_user_handle(dto),
		get_id: get_user_id(dto),
		get_last_name: get_user_last_name(dto),
		get_readable_name: get_user_readable_name(dto),
		get_subscription: get_user_subscription(dto),
		is_newer_than: is_user_newer_than(dto),
		is_older_than: is_user_older_than(dto),
		is_paid: is_user_subscription_paid(dto),
		to_dto: () => dto,
	}),
}