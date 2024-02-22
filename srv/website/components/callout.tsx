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

import {
	BsInfoCircle,
	BsQuestionCircle,
	BsXCircle,
	BsExclamationCircle,
	BsCheckCircle,
	BsCircle,
} from "react-icons/bs"
import { Switch } from "@ordo-pink/switch"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
	type?: "info" | "warn" | "error" | "success" | "question"
}>

const InfoIcon = () => <BsInfoCircle className="shrink-0 text-xl text-sky-500" />
const WarnIcon = () => <BsExclamationCircle className="shrink-0 text-xl text-amber-500" />
const SuccessIcon = () => <BsCheckCircle className="shrink-0 text-xl text-emerald-500" />
const QuestionIcon = () => <BsQuestionCircle className="shrink-0 text-xl text-violet-500" />
const RrrIcon = () => <BsXCircle className="shrink-0 text-xl text-rose-500" />
const DefaultIcon = () => <BsCircle className="shrink-0 text-xl text-neutral-500" />

export const Callout = ({ type, children }: Props) => {
	let Icon!: () => JSX.Element
	let background!: string

	Switch.of(type)
		.case("info", () => {
			background = "bg-sky-100 dark:bg-sky-800"
			Icon = InfoIcon
		})
		.case("warn", () => {
			background = "bg-amber-100 dark:bg-amber-800"
			Icon = WarnIcon
		})
		.case("success", () => {
			background = "bg-emerald-100 dark:bg-emerald-800"
			Icon = SuccessIcon
		})
		.case("question", () => {
			background = "bg-violet-100 dark:bg-violet-800"
			Icon = QuestionIcon
		})
		.case("error", () => {
			background = "bg-rose-100 dark:bg-rose-800"
			Icon = RrrIcon
		})
		.default(() => {
			background = "bg-neutral-200 dark:bg-neutral-600"
			Icon = DefaultIcon
		})

	return (
		<div
			className={`${background} flex w-full max-w-lg items-center space-x-4 rounded-lg px-4 py-2 shadow-sm`}
		>
			<Icon />
			<div className="text-sm">{children}</div>
		</div>
	)
}
