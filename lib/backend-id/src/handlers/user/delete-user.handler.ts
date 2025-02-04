import { Oath, ops0 } from "@ordo-pink/oath"

import { check_if_edited_user_is_current_user } from "../../common/check-if-edited-user-is-current-user"
import { check_if_id_param_is_valid } from "../../common/validate-id-param"
import { default_handler } from "../default.handler"

export const handle_delete_user = default_handler(intake =>
	Oath.Merge([check_if_edited_user_is_current_user(intake), check_if_id_param_is_valid(intake)])
		.and(() => intake.params.user_id as Ordo.User.ID)
		.and(id => intake.user_persistence_strategy.remove(id).pipe(ops0.rejected_map(rrr => ({ rrr, intake }))))
		.and(() => intake),
)
