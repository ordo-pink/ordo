/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CurrentUser, CurrentUserKeys, METADATA_CONTENT_FSID, Metadata, RRR } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { Routary, routary } from "@ordo-pink/routary"
import {
	create_response,
	default_handler,
	extract_request_ip,
	log_request,
	start_response_timer,
	status_from_rrr,
	stop_response_timer,
} from "@ordo-pink/routary-ordo"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import { is_finite_non_negative_int } from "@ordo-pink/tau"
import { rickroll } from "@ordo-pink/rickroll"
import { routary_cors } from "@ordo-pink/routary-cors"

import { type TDTChamber, type TDTContext } from "./backend-dt.types"

// TODO Extract colonoscope from Routary
// TODO WebSocket for dt-dt and dt-web notifications
export const create_backend_dt = (chamber: TDTChamber) =>
	routary
		.create<TDTContext>({ ...chamber, headers: new Headers(), status: 200, request_language: TWO_LETTER_LOCALE.ENGLISH })
		.head("/:uid/:fsid", intake => {
			return Oath.Resolve(intake)
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.chain(validate_request_params))
				.pipe(ops0.chain(authenticate))
				.pipe(ops0.chain(check_authorization(intake)))
				.pipe(ops0.map(extract_ids(intake)))
				.pipe(ops0.chain(check_file_exists(intake)))
				.pipe(ops0.chain(set_last_modified_header(intake)))
				.pipe(ops0.map(() => intake))
				.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
				.fix(status_from_rrr)
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.map(create_response))
				.invoke(invokers0.force_resolve)
		})

		.get("/:uid/:fsid", intake => {
			return Oath.Resolve(intake)
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.chain(validate_request_params))
				.pipe(ops0.chain(authenticate))
				.pipe(ops0.chain(check_authorization(intake)))
				.pipe(ops0.map(extract_ids(intake)))
				.pipe(ops0.chain(check_file_exists(intake)))
				.pipe(ops0.chain(set_last_modified_header(intake)))
				.pipe(ops0.chain(({ uid, fsid }) => intake.data_persistence_strategy.read(uid, fsid)))
				.pipe(ops0.tap(file => void (intake.payload = file)))
				.pipe(ops0.map(() => intake))
				.pipe(ops0.tap(intake => intake.headers.set("Content-Type", "application/octet-stream")))
				.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
				.fix(status_from_rrr)
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.map(create_response))
				.invoke(invokers0.force_resolve)
		})

		.post(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(ops0.chain(validate_body_is_not_empty))
					.pipe(ops0.chain(authenticate))
					.pipe(ops0.chain(check_authorization(intake)))
					.pipe(ops0.chain(check_can_create_files(intake)))
					.pipe(ops0.chain(validate_file_size_limit(intake)))
					.pipe(ops0.map(extract_ids(intake)))
					.pipe(ops0.chain(check_file_does_not_exist(intake)))
					.pipe(ops0.chain(({ uid, fsid }) => intake.data_persistence_strategy.create(uid, fsid, intake.req.body!)))
					.pipe(ops0.map(() => intake))
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
			),
		)

		.put(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(ops0.chain(validate_body_is_not_empty))
					.pipe(ops0.chain(authenticate))
					.pipe(ops0.chain(check_authorization(intake)))
					.pipe(ops0.chain(check_total_files_limit_if_file_does_not_exist(intake)))
					.pipe(ops0.chain(validate_file_size_limit(intake)))
					.pipe(ops0.map(extract_ids(intake)))
					.pipe(ops0.chain(({ uid, fsid }) => intake.data_persistence_strategy.update(uid, fsid, intake.req.body!)))
					.pipe(ops0.map(() => intake))
					.pipe(ops0.map(() => intake))
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
			),
		)

		.delete(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(ops0.chain(authenticate))
					.pipe(ops0.chain(check_authorization(intake)))
					.pipe(ops0.map(extract_ids(intake)))
					.pipe(ops0.chain(check_file_exists(intake)))
					.pipe(ops0.chain(({ uid, fsid }) => intake.data_persistence_strategy.delete(uid, fsid)))
					.pipe(ops0.map(() => intake))
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
			),
		)

		.get("/healthcheck", () => new Response("OK"))

		.use(
			routary_cors({
				allow_origin: chamber.allow_origin,
				allow_headers: ["content-type", "authorization"],
				allow_credentials: true,
			}),
		)

		.start(() => rickroll)

export const validate_request_params = (intake: Routary.Intake<TDTContext>) =>
	Oath.Merge([
		Oath.If(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid FSID"))),
		Oath.If(CurrentUser.Validations.is_uid(intake.params.uid)).pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid UID"))),
	]).pipe(ops0.map(() => intake))

export const authenticate = (intake: Routary.Intake<TDTContext>) =>
	Oath.Resolve(intake.req.headers)
		.pipe(ops0.map(headers => ({ headers, method: "GET", credentials: "include" as const })))
		.pipe(ops0.chain(init => Oath.FromPromise(() => fetch(`${intake.id_host}/session`, init))))
		.pipe(ops0.chain(res => Oath.FromPromise(() => res.json())))
		.pipe(ops0.chain(body => Oath.If(body?.success, { T: () => body.payload })))
		.pipe(ops0.chain(x => Oath.If(CurrentUser.Validations.is_dto(x), { T: () => x as Ordo.User.Current.DTO })))
		.pipe(ops0.rejected_map(e => RRR.codes.eacces(e?.message ?? "Unauthorized")))

// TODO checking permissions for editing files of other users
export const check_authorization = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	Oath.If(user[CurrentUserKeys.UID] === intake.params.uid)
		.pipe(ops0.map(() => user))
		.pipe(ops0.rejected_map(() => RRR.codes.eperm("Permission denied")))

export const check_file_exists =
	(intake: Routary.Intake<TDTContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(ops0.chain(exists => Oath.If(exists)))
			.pipe(ops0.map(() => ({ uid, fsid })))
			.pipe(ops0.rejected_map(() => RRR.codes.enoent("File not found")))

export type TIDs = { uid: Ordo.User.UID; fsid: Ordo.Metadata.FSID }
export const extract_ids = (intake: Routary.Intake<TDTContext>) => () => ({
	uid: intake.params.uid as Ordo.User.UID,
	fsid: intake.params.fsid as Ordo.Metadata.FSID,
})

const check_file_does_not_exist =
	(intake: Routary.Intake<TDTContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(ops0.chain(exists => Oath.If(!exists)))
			.pipe(ops0.map(() => ({ uid, fsid })))
			.pipe(ops0.rejected_map(() => RRR.codes.eexist("File already exists")))

export const validate_body_is_not_empty = (intake: Routary.Intake<TDTContext>) =>
	Oath.FromNullable(intake.req.body)
		.pipe(ops0.map(() => intake))
		.pipe(ops0.rejected_map(() => RRR.codes.einval("Empty file body")))

export const validate_file_size_limit = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	Oath.FromNullable(intake.req.headers.get("content-length"))
		.pipe(ops0.map(file_size => Number.parseInt(file_size, 10)))
		.pipe(ops0.chain(file_size => Oath.If(is_finite_non_negative_int(file_size), { T: () => file_size })))
		.pipe(ops0.chain(file_size => Oath.If(CurrentUser.FromDTO(user).can_upload(file_size))))
		.pipe(ops0.rejected_map(() => RRR.codes.efbig("File too big")))

// TODO check if attemted to create a file in other user's space
export const check_can_create_files = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	intake.data_persistence_strategy
		.read(user[CurrentUserKeys.UID], METADATA_CONTENT_FSID)
		.pipe(ops0.chain(stream => Oath.Try(() => new Response(stream).json())))
		.pipe(ops0.map(metadata => metadata.length))
		.fix(() => 0)
		.pipe(ops0.map(total_files => CurrentUser.FromDTO(user).can_create_files(total_files)))
		.pipe(ops0.chain(can_create => Oath.If(can_create)))
		.pipe(ops0.map(() => user))
		.pipe(ops0.rejected_map(() => RRR.codes.enospc("Too many files")))

const check_total_files_limit_if_file_does_not_exist = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	intake.data_persistence_strategy
		.exists(intake.params.uid as Ordo.User.UID, intake.params.fsid as Ordo.Metadata.FSID)
		.pipe(ops0.chain(exists => (exists ? Oath.Resolve(user) : check_can_create_files(intake)(user))))

const set_last_modified_header =
	(intake: Routary.Intake<TDTContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.mtime(uid, fsid)
			.pipe(ops0.map(mtime => new Date(mtime)))
			.pipe(ops0.map(date => date.toUTCString()))
			.pipe(ops0.tap(last_modified => intake.headers.set("Last-Modified", last_modified)))
			.pipe(ops0.map(() => ({ uid, fsid })))
