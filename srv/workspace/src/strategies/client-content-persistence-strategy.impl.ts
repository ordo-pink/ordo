// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Hosts } from "$utils/hosts"
import { AuthResponse } from "@ordo-pink/backend-server-id"
import { ContentPersistenceStrategy, Data, UnexpectedError } from "@ordo-pink/data"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject } from "rxjs"

const of = (auth$: BehaviorSubject<AuthResponse>): ContentPersistenceStrategy<any> => ({
	create: () => Oath.of("OK"),
	delete: () => Oath.of("OK"),
	read: (uid, fsid) =>
		Oath.fromNullable(auth$.value)
			.rejectedMap(() => Data.Errors.DataNotFound)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${uid}/${fsid}`, {
						method: "GET",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.text()),
				),
			),
	write: (uid, fsid, content) =>
		Oath.fromNullable(auth$.value)
			.rejectedMap(() => UnexpectedError(new Error("Something went wrong")))
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${uid}/${fsid}/update`, {
						method: "PUT",
						headers: {
							authorization: `Bearer ${auth.accessToken}`,
						},
						body: content,
					})
						.then(res => res.json())
						.then(json => json.result),
				),
			),
})

export const ClientContentPersistenceStrategy = { of }
