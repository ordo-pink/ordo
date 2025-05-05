/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { current_user, CURRENT_USER_KEYS, METADATA_CONTENT_FSID, Metadata, rrr } from "@ordo-pink/core"
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
import { oath } from "@ordo-pink/oath"
import { rickroll } from "@ordo-pink/rickroll"
import { routary_cors } from "@ordo-pink/routary-cors"

import { type TDTFuel, type TDTContext } from "./backend-server-dt.types"

// TODO Extract colonoscope from Routary
// TODO WebSocket for dt-dt and dt-web notifications
export const create_backend_server_dt = (chamber: TDTFuel) =>
	routary
		.http<TDTContext>({ ...chamber, headers: new Headers(), status: 200, request_language: TWO_LETTER_LOCALE.ENGLISH })
		.head("/:uid/:fsid", intake => {
			return oath
				.of(intake)
				.pipe(oath.ops.tap(start_response_timer))
				.pipe(oath.ops.tap(extract_request_ip))
				.pipe(oath.ops.chain(validate_request_params))
				.pipe(oath.ops.chain(authenticate))
				.pipe(oath.ops.chain(check_authorization(intake)))
				.pipe(oath.ops.map(extract_ids(intake)))
				.pipe(oath.ops.chain(check_file_exists(intake)))
				.pipe(oath.ops.chain(set_last_modified_header(intake)))
				.pipe(oath.ops.map(() => intake))
				.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
				.pipe(oath.ops.fix(status_from_rrr))
				.pipe(oath.ops.tap(stop_response_timer))
				.pipe(oath.ops.tap(log_request))
				.pipe(oath.ops.map(create_response))
				.cata(oath.catas.unwrap())
		})

		.get("/:uid/:fsid", intake => {
			return oath
				.of(intake)
				.pipe(oath.ops.tap(start_response_timer))
				.pipe(oath.ops.tap(extract_request_ip))
				.pipe(oath.ops.chain(validate_request_params))
				.pipe(oath.ops.chain(authenticate))
				.pipe(oath.ops.chain(check_authorization(intake)))
				.pipe(oath.ops.map(extract_ids(intake)))
				.pipe(oath.ops.chain(check_file_exists(intake)))
				.pipe(oath.ops.chain(set_last_modified_header(intake)))
				.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.read(uid, fsid)))
				.pipe(oath.ops.tap(file => void (intake.payload = file)))
				.pipe(oath.ops.map(() => intake))
				.pipe(oath.ops.tap(intake => intake.headers.set("Content-Type", "application/octet-stream")))
				.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
				.pipe(oath.ops.fix(status_from_rrr))
				.pipe(oath.ops.tap(stop_response_timer))
				.pipe(oath.ops.tap(log_request))
				.pipe(oath.ops.map(create_response))
				.cata(oath.catas.unwrap())
		})

		.post(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(oath.ops.chain(validate_body_is_not_empty))
					.pipe(oath.ops.chain(authenticate))
					.pipe(oath.ops.chain(check_authorization(intake)))
					.pipe(oath.ops.chain(check_can_create_files(intake)))
					.pipe(oath.ops.chain(validate_file_size_limit(intake)))
					.pipe(oath.ops.map(extract_ids(intake)))
					.pipe(oath.ops.chain(check_file_does_not_exist(intake)))
					.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.create(uid, fsid, intake.req.body!)))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake }))),
			),
		)

		.put(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(oath.ops.chain(validate_body_is_not_empty))
					.pipe(oath.ops.chain(authenticate))
					.pipe(oath.ops.chain(check_authorization(intake)))
					.pipe(oath.ops.chain(check_total_files_limit_if_file_does_not_exist(intake)))
					.pipe(oath.ops.chain(validate_file_size_limit(intake)))
					.pipe(oath.ops.map(extract_ids(intake)))
					.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.update(uid, fsid, intake.req.body!)))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake }))),
			),
		)

		.delete(
			"/:uid/:fsid",
			default_handler(intake =>
				validate_request_params(intake)
					.pipe(oath.ops.chain(authenticate))
					.pipe(oath.ops.chain(check_authorization(intake)))
					.pipe(oath.ops.map(extract_ids(intake)))
					.pipe(oath.ops.chain(check_file_exists(intake)))
					.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.delete(uid, fsid)))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake }))),
			),
		)

		.get("/healthcheck", () => new Response("OK"))

		.use(
			routary_cors({
				allow_origin: chamber.allow_origin,
				allow_headers: ["content-type"],
				allow_credentials: true,
			}),
		)

		.start(() => rickroll)

export const validate_request_params = (intake: Routary.Intake<TDTContext>) =>
	oath
		.all([
			oath.if(Metadata.Validations.is_fsid(intake.params.fsid)).pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid FSID"))),
			oath.if(current_user.validations.is_uid(intake.params.uid)).pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid UID"))),
		])
		.pipe(oath.ops.map(() => intake))

export const authenticate = (intake: Routary.Intake<TDTContext>) =>
	oath
		.of(intake.req.headers)
		.pipe(oath.ops.map(headers => ({ headers, method: "GET", credentials: "include" as const })))
		.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${intake.id_host}/session`, init))))
		.pipe(oath.ops.chain(res => oath.from_promise(() => res.json())))
		.pipe(oath.ops.chain(body => oath.if(body?.success, { on_true: () => body.payload })))
		.pipe(oath.ops.chain(x => oath.if(current_user.validations.is_dto(x), { on_true: () => x as Ordo.User.Current.DTO })))
		.pipe(oath.ops.rmap(e => rrr.codes.eacces("Unauthorized", e)))

// TODO checking permissions for editing files of other users
export const check_authorization = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	oath
		.if(user[CURRENT_USER_KEYS.UID] === intake.params.uid)
		.pipe(oath.ops.map(() => user))
		.pipe(oath.ops.rmap(() => rrr.codes.eperm("Permission denied")))

export const check_file_exists =
	(intake: Routary.Intake<TDTContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(oath.ops.chain(exists => oath.if(exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.codes.enoent("File not found")))

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
			.pipe(oath.ops.chain(exists => oath.if(!exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.codes.eexist("File already exists")))

export const validate_body_is_not_empty = (intake: Routary.Intake<TDTContext>) =>
	oath
		.from_nullable(intake.req.body)
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rmap(() => rrr.codes.einval("Empty file body")))

export const validate_file_size_limit = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	oath
		.from_nullable(intake.req.headers.get("content-length"))
		.pipe(oath.ops.map(file_size => Number.parseInt(file_size, 10)))
		.pipe(oath.ops.chain(file_size => oath.if(is_finite_non_negative_int(file_size), { on_true: () => file_size })))
		.pipe(oath.ops.chain(file_size => oath.if(current_user.from_dto(user).can_upload(file_size))))
		.pipe(oath.ops.rmap(() => rrr.codes.efbig("File too big")))

// TODO check if attemted to create a file in other user's space
export const check_can_create_files = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	intake.data_persistence_strategy
		.read(user[CURRENT_USER_KEYS.UID], METADATA_CONTENT_FSID)
		.pipe(oath.ops.chain(stream => oath.from_promise(() => new Response(stream).json())))
		.pipe(oath.ops.map(metadata => metadata.length))
		.pipe(oath.ops.fix(() => 0))
		.pipe(oath.ops.map(total_files => current_user.from_dto(user).can_create_files(total_files)))
		.pipe(oath.ops.chain(can_create => oath.if(can_create)))
		.pipe(oath.ops.map(() => user))
		.pipe(oath.ops.rmap(() => rrr.codes.enospc("Too many files")))

const check_total_files_limit_if_file_does_not_exist = (intake: Routary.Intake<TDTContext>) => (user: Ordo.User.Current.DTO) =>
	intake.data_persistence_strategy
		.exists(intake.params.uid as Ordo.User.UID, intake.params.fsid as Ordo.Metadata.FSID)
		.pipe(oath.ops.chain(exists => (exists ? oath.of(user) : check_can_create_files(intake)(user))))

const set_last_modified_header =
	(intake: Routary.Intake<TDTContext>) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.mtime(uid, fsid)
			.pipe(oath.ops.map(mtime => new Date(mtime)))
			.pipe(oath.ops.map(date => date.toUTCString()))
			.pipe(oath.ops.tap(last_modified => intake.headers.set("Last-Modified", last_modified)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
