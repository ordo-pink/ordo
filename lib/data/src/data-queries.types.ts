// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Nullable } from "@ordo-pink/tau"
import type { FSID, PlainData, TData } from "./data.types"

export type RequiredQueryParams = Pick<PlainData, "createdBy">

export type TDataQueries<T> = {
	findByName: (params: RequiredQueryParams & Pick<PlainData, "name">) => Nullable<TData>
	findByPath: (params: RequiredQueryParams & { path: string }) => Nullable<TData>
	getDirectChildren: (params: RequiredQueryParams & { fsid: FSID }) => Nullable<TData[]>
}
