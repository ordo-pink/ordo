// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type { BehaviorSubject, Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TFetch } from "@ordo-pink/core"
import type { TResult } from "@ordo-pink/result"

import type { TMetadata, TMetadataDTO } from "./metadata.types"
import type { TRrr } from "./metadata.errors"

export type TMetadataRepository = {
	get: () => TResult<TMetadata[], TRrr<"EAGAIN">>
	put: (metadata: TMetadata[]) => TResult<void, TRrr<"EINVAL">>
	get sub(): Observable<number>
}

export type TAsyncMetadataRepository = {
	get: (token: string) => Oath<TMetadataDTO[], TRrr<"EIO">>
	put: (token: string, metadata: TMetadataDTO[]) => Oath<void, TRrr<"EINVAL" | "EIO">>
}

export type TMetadataRepositoryStatic = {
	of: (metadata$: BehaviorSubject<TMetadata[] | null>) => TMetadataRepository
}

export type TRemoteMetadataRepositoryStatic = {
	of: (data_host: string, fetch: TFetch) => TAsyncMetadataRepository
}
