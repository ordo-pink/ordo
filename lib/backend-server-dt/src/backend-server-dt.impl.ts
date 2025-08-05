/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CORE, type Data, type User, data, rrr, user } from "@ordo-pink/sdk-core"
import {
	create_response,
	default_handler,
	extract_request_ip,
	log_request,
	count_response_time,
	status_from_rrr,
	stop_response_timer,
} from "@ordo-pink/b-server-core"
import { LOCALE } from "@ordo-pink/oss-i18n"
import { is_finite_non_negative_int } from "@ordo-pink/_tau"
import { oath } from "@ordo-pink/oss-oath"
import { rickroll } from "@ordo-pink/oss-rickroll"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"

import type { ServerDT } from "./backend-server-dt.types"

// TODO WebSocket for dt-dt and dt-web notifications
export const create_backend_server_dt = (fuel: ServerDT.Params) =>
	routary
		.http<ServerDT.Fuel>({ ...fuel, headers: new Headers(), status: 200, request_language: LOCALE.ENGLISH })
		.head("/:uid/:fsid", intake => {
			return oath
				.of(intake)
				.pipe(oath.ops.tap(count_response_time))
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
				.pipe(oath.ops.tap(count_response_time))
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
				allow_origin: fuel.allow_origin,
				allow_headers: ["content-type"],
				allow_credentials: true,
			}),
		)

		.start(() => rickroll)

export const validate_request_params = (intake: ServerDT.Intake) =>
	oath
		.all([
			oath.if(data.validations.is_id(intake.params.fsid)).pipe(oath.ops.rmap(() => rrr.einval("Invalid data id"))),
			oath.if(user.current.validations.is_id(intake.params.uid)).pipe(oath.ops.rmap(() => rrr.einval("Invalid user id"))),
		])
		.pipe(oath.ops.map(() => intake))

export const authenticate = (intake: ServerDT.Intake) =>
	oath
		.of(intake.req.headers)
		.pipe(oath.ops.map(headers => ({ headers, method: "GET", credentials: "include" as const })))
		.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${intake.id_host}/session`, init))))
		.pipe(oath.ops.chain(res => oath.from_promise(() => res.json())))
		.pipe(oath.ops.chain(body => oath.if(body?.success, { on_true: () => body.payload })))
		.pipe(oath.ops.chain(x => oath.if(user.current.validations.is_dto(x), { on_true: () => x as User.Current.DTO })))
		.pipe(oath.ops.rmap(e => rrr.eacces("Unauthorized", e)))

// TODO checking permissions for editing files of other users
export const check_authorization = (intake: ServerDT.Intake) => (user: User.Current.DTO) =>
	oath
		.if(user[0] === intake.params.uid)
		.pipe(oath.ops.map(() => user))
		.pipe(oath.ops.rmap(() => rrr.eperm("Permission denied")))

export const check_file_exists =
	(intake: ServerDT.Intake) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(oath.ops.chain(exists => oath.if(exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.enoent("File not found")))

export type TIDs = { uid: User.ID; fsid: Data.ID }
export const extract_ids = (intake: ServerDT.Intake) => () => ({
	uid: intake.params.uid as User.ID,
	fsid: intake.params.fsid as Data.ID,
})

const check_file_does_not_exist =
	(intake: ServerDT.Intake) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(oath.ops.chain(exists => oath.if(!exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.eexist("File already exists")))

export const validate_body_is_not_empty = (intake: ServerDT.Intake) =>
	oath
		.from_nullable(intake.req.body)
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rmap(() => rrr.einval("Empty file body")))

export const validate_file_size_limit = (intake: ServerDT.Intake) => (dto: User.Current.DTO) =>
	oath
		.from_nullable(intake.req.headers.get("content-length"))
		.pipe(oath.ops.map(file_size => Number.parseInt(file_size, 10)))
		.pipe(oath.ops.chain(file_size => oath.if(is_finite_non_negative_int(file_size), { on_true: () => file_size })))
		.pipe(oath.ops.chain(file_size => oath.if(user.current.from_dto(...dto).can_upload_file(file_size))))
		.pipe(oath.ops.rmap(() => rrr.efbig("File too big")))

// TODO check if attemted to create a file in other user's space
export const check_can_create_files = (intake: ServerDT.Intake) => (dto: User.Current.DTO) =>
	intake.data_persistence_strategy
		.read(dto[0], CORE.ROOT_METADATA_FILE_ID)
		.pipe(oath.ops.chain(stream => oath.from_promise(() => new Response(stream).json())))
		.pipe(oath.ops.map(metadata => metadata.length))
		.pipe(oath.ops.fix(() => 0))
		.pipe(oath.ops.map(total_files => user.current.from_dto(...dto).can_create_file(total_files)))
		.pipe(oath.ops.chain(can_create => oath.if(can_create)))
		.pipe(oath.ops.map(() => dto))
		.pipe(oath.ops.rmap(() => rrr.enospc("Too many files")))

const check_total_files_limit_if_file_does_not_exist = (intake: ServerDT.Intake) => (user: User.Current.DTO) =>
	intake.data_persistence_strategy
		.exists(intake.params.uid as User.ID, intake.params.fsid as Data.ID)
		.pipe(oath.ops.chain(exists => (exists ? oath.of(user) : check_can_create_files(intake)(user))))

const set_last_modified_header =
	(intake: ServerDT.Intake) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.mtime(uid, fsid)
			.pipe(oath.ops.map(mtime => new Date(mtime)))
			.pipe(oath.ops.map(date => date.toUTCString()))
			.pipe(oath.ops.tap(last_modified => intake.headers.set("Last-Modified", last_modified)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
