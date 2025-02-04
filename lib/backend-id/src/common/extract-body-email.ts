import { Oath, ops0 } from "@ordo-pink/oath"
import { CurrentUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { email_missing_rrr, invalid_email_rrr } from "../rrrs/invalid-user-email.rrr"
import { type TSharedContext } from "../backend-id.types"

export const extract_body_email = (intake: TIntake<TSharedContext>) => (request_body: any) =>
	Oath.FromNullable(request_body.email)
		.pipe(ops0.rejected_map(() => email_missing_rrr(intake)))
		.pipe(ops0.chain(email => Oath.If(is_email(email), { T: () => email, F: () => invalid_email_rrr(email, intake) })))

// --- Internal ---

const is_email = CurrentUser.Validations.is_email
