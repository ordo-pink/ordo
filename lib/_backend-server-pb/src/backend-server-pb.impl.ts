/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { CORE, type Data, type User, data, rrr, user } from "@ordo-pink/sdk-core"
import {
	create_response,
	extract_request_ip,
	log_request,
	count_response_time,
	status_from_rrr,
	stop_response_timer,
} from "@ordo-pink/sdk-server-routary"
import { LOCALE } from "@ordo-pink/oss-i18n"
import { oath } from "@ordo-pink/oss-oath"
import { rickroll } from "@ordo-pink/oss-rickroll"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"

import type { ServerPB } from "./backend-server-pb.types"

export const create_backend_server_pb = (fuel: ServerPB.Params) =>
	routary
		.http<ServerPB.Fuel>({ ...fuel, headers: new Headers(), status: 200, request_language: LOCALE.ENGLISH })
		.get("/:handle/:fsid", intake => {
			return (
				oath
					.of(intake)
					.pipe(oath.ops.tap(count_response_time))
					.pipe(oath.ops.tap(extract_request_ip))
					.pipe(oath.ops.chain(validate_request_params))
					.pipe(oath.ops.map(extract_ids(intake)))
					.pipe(
						oath.ops.chain(({ handle, fsid }) =>
							oath
								.from_promise(() => fetch(`${intake.id_host}/users/handle/${handle}`))
								.pipe(oath.ops.chain(res => oath.from_promise(() => res.json())))
								.pipe(oath.ops.chain(res => oath.if_else(res.success, { t: () => res.payload as User.Someone.DTO })))
								.pipe(oath.ops.map(user => ({ uid: user[0], fsid })))
								.pipe(oath.ops.rmap(() => rrr.enoent("User not found"))),
						),
					)
					.pipe(oath.ops.chain(check_file_exists(intake)))
					.pipe(
						oath.ops.chain(({ uid, fsid }) =>
							intake.data_persistence_strategy
								.read(uid, CORE.ROOT_METADATA_FILE_ID)
								.pipe(oath.ops.chain(stream => oath.from_promise(() => new Response(stream).json() as Promise<Data.DTO[]>)))
								.pipe(oath.ops.chain(metadata => oath.from_nullable(metadata.find(item => item[0] === fsid))))
								.pipe(oath.ops.rmap(() => rrr.enoent("User metadata not found")))
								.pipe(
									oath.ops.chain(m =>
										oath
											.if(!!m[12] && !!m[12].public_id, { t: () => m })
											.pipe(oath.ops.tap(m => intake.headers.set("Last-Modified", new Date(m[2]).toUTCString())))
											.pipe(oath.ops.tap(() => intake.headers.set("Content-Type", "text/html")))
											.pipe(oath.ops.map(m => ({ uid, fsid: m[12]!.public_id as Data.ID })))
											.pipe(oath.ops.rmap(() => rrr.enoent("File not found"))),
									),
								),
						),
					)
					// TODO Check file is public
					.pipe(oath.ops.chain(({ uid, fsid }) => intake.data_persistence_strategy.read(uid, fsid)))
					.pipe(oath.ops.tap(file => void (intake.payload = file)))
					.pipe(oath.ops.map(() => intake))
					.pipe(oath.ops.rmap(rrr => ({ rrr, intake: intake })))
					.pipe(oath.ops.fix(status_from_rrr))
					.pipe(oath.ops.tap(stop_response_timer))
					.pipe(oath.ops.tap(log_request))
					.pipe(oath.ops.map(create_response))
					.cata(oath.catas.unwrap())
			)
		})

		.get("/healthcheck", () => new Response("OK"))

		.use(routary_cors({ allow_origin: fuel.allow_origin, allow_headers: ["content-type"] }))

		.start(() => rickroll)

const validate_request_params = (intake: ServerPB.Intake) =>
	oath
		.all([
			oath.if_else(data.validations.is_id(intake.params.fsid)).pipe(oath.ops.rmap(() => rrr.einval("invalid data id"))),
			oath
				.if_else(user.current.validations.is_handle(intake.params.handle))
				.pipe(oath.ops.rmap(() => rrr.einval("invalid handle"))),
		])
		.pipe(oath.ops.map(() => intake))

const check_file_exists =
	(intake: ServerPB.Intake) =>
	({ uid, fsid }: TIDs) =>
		intake.data_persistence_strategy
			.exists(uid, fsid)
			.pipe(oath.ops.chain(exists => oath.if_else(exists)))
			.pipe(oath.ops.map(() => ({ uid, fsid })))
			.pipe(oath.ops.rmap(() => rrr.enoent("File not found")))

type TIDs = { uid: User.ID; fsid: Data.ID }
const extract_ids = (intake: ServerPB.Intake) => () => ({
	handle: intake.params.handle as User.Handle,
	fsid: intake.params.fsid as Data.ID,
})
