import { Oath, ops0 } from "@ordo-pink/oath"
import { CurrentUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"
import { extract_request_body } from "@ordo-pink/backend-util-extract-body"

import { exists_by_email_rrr, invalid_email_rrr } from "../../rrrs/invalid-user-email.rrr"
import { exists_by_handle, invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"
import { invalid_first_name_rrr, invalid_installed_functions_rrr, invalid_last_name_rrr } from "../../rrrs/user-field.rrr"
import { type TSharedContext } from "../../backend-id.types"
import { check_if_edited_user_is_current_user } from "../../common/check-if-edited-user-is-current-user"
import { check_if_id_param_is_valid } from "../../common/validate-id-param"
import { default_handler } from "../default.handler"

export const handle_update_user = default_handler(intake =>
	Oath.Merge([check_if_edited_user_is_current_user(intake), check_if_id_param_is_valid(intake)])
		.pipe(ops0.chain(() => extract_request_body(intake)))
		.pipe(ops0.chain(valdiate_body(intake)))
		.pipe(ops0.chain(get_current_user(intake)))
		.pipe(ops0.map(merge_users))
		.pipe(ops0.chain(update_user(intake.params.user_id as Ordo.User.ID, intake)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

const { is_email, is_handle, is_installed_functions, is_first_name, is_last_name } = CurrentUser.Validations

type I = TIntake<TSharedContext>

const check_email_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.email
		? Oath.If(is_email(body.email), { F: () => invalid_email_rrr(body.email, i) })
				.and(() => body.email as Ordo.User.Email)
				.pipe(ops0.chain(email => i.user_persistence_strategy.get_by_email(email).fix(() => null)))
				.pipe(
					ops0.chain(user => Oath.If(!user || user.id === i.params.user_id, { F: () => exists_by_email_rrr(body.email, i) })),
				)
		: Oath.Resolve(void 0)

const check_handle_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.handle
		? Oath.If(is_handle(body.handle), { F: () => invalid_handle_rrr(body.handle, i) })
				.and(() => body.handle as Ordo.User.Handle)
				.pipe(ops0.chain(handle => i.user_persistence_strategy.get_by_handle(handle).fix(() => null)))
				.pipe(ops0.chain(user => Oath.If(!user || user.id === i.params.user_id, { F: () => exists_by_handle(body.handle, i) })))
		: Oath.Resolve(void 0)

const check_installed_functions_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.installed_functions
		? Oath.If(is_installed_functions(body.installed_functions), {
				F: () => invalid_installed_functions_rrr(body.installed_functions, i),
			})
		: Oath.Resolve(void 0)

const check_first_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.first_name
		? Oath.If(is_first_name(body.first_name), { F: () => invalid_first_name_rrr(body.first_name, i) })
		: Oath.Resolve(void 0)

const check_last_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.last_name
		? Oath.If(is_last_name(body.last_name), { F: () => invalid_last_name_rrr(body.last_name, i) })
		: Oath.Resolve(void 0)

const valdiate_body = (i: I) => (body: Record<string, any>) =>
	Oath.Merge([
		check_email_is_not_taken_if_present(body, i),
		check_handle_is_not_taken_if_present(body, i),
		check_installed_functions_is_valid_if_present(body, i),
		check_first_name_is_valid_if_present(body, i),
		check_last_name_is_valid_if_present(body, i),
	]).pipe(ops0.map(() => body as Partial<OrdoInternal.User.PrivateDTO>))

const get_current_user = (i: I) => (updated_user: Partial<OrdoInternal.User.PrivateDTO>) =>
	i.user_persistence_strategy
		.get_by_id(i.params.user_id as Ordo.User.ID)
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake: i })))
		.pipe(ops0.map(user => ({ user, updated_user })))

const update_user = (id: Ordo.User.ID, intake: I) => (user: OrdoInternal.User.PrivateDTO) =>
	intake.user_persistence_strategy.update(id, user).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))

const merge_users = (users: {
	user: OrdoInternal.User.PrivateDTO
	updated_user: Partial<OrdoInternal.User.PrivateDTO>
}): OrdoInternal.User.PrivateDTO => ({
	created_at: users.user.created_at,
	email_code: users.user.email_code,
	file_limit: users.user.file_limit,
	id: users.user.id,
	max_functions: users.user.max_functions,
	max_upload_size: users.user.max_upload_size,
	password: users.user.password,
	subscription: users.user.subscription,
	email: users.updated_user.email ?? users.user.email,
	first_name: users.updated_user.first_name ?? users.user.first_name,
	handle: users.updated_user.handle ?? users.user.handle,
	installed_functions: users.updated_user.installed_functions ?? users.user.installed_functions,
	last_name: users.updated_user.last_name ?? users.user.last_name,
})
