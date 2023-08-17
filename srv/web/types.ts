// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export type Slashless<Str> = Str extends `${string}/${string}` ? never : Str

export type Activity<Str extends string = string> = {
	name: Slashless<Str>
	version: string
	background: boolean
}
