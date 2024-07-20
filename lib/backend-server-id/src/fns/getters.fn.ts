import { isEmail } from "validator"

import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { is_string } from "@ordo-pink/tau"
import { okpwd } from "@ordo-pink/okpwd"

export const get_body_email0 = (email?: User.User["email"]) =>
	Oath.FromNullable(email)
		.pipe(Oath.ops.chain(email => Oath.If(isEmail(email), { T: () => email })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_email -> email: ${email}`)))

export const get_body_handle0 = (handle?: User.User["handle"]) =>
	Oath.FromNullable(handle)
		.pipe(Oath.ops.chain(handle => Oath.If(isEmail(handle), { T: () => handle })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_handle -> handle: ${handle}`)))

export const get_body_password0 = (password?: User.PrivateUser["password"]) =>
	Oath.FromNullable(password)
		.pipe(Oath.ops.map(okpwd()))
		.pipe(Oath.ops.chain(error => Oath.If(!!error, { T: () => password!, F: () => error })))
		.pipe(Oath.ops.rejected_map(error => einval(`get_password -> error: ${error}`)))

export const get_first_name0 = (first_name?: User.User["first_name"]) =>
	Oath.FromNullable(first_name)
		.pipe(Oath.ops.chain(first_name => Oath.If(is_string(first_name), { T: () => first_name })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_first_name -> first_name: ${first_name}`)))

export const get_last_name0 = (last_name?: User.User["last_name"]) =>
	Oath.FromNullable(last_name)
		.pipe(Oath.ops.chain(last_name => Oath.If(is_string(last_name), { T: () => last_name })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_last_name -> last_name: ${last_name}`)))

const einval = RRR.codes.einval("getters")
