// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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

const InfoIcon = () => <BsInfoCircle className="shrink-0 text-sky-500 text-xl" />
const WarnIcon = () => <BsExclamationCircle className="shrink-0 text-amber-500 text-xl" />
const SuccessIcon = () => <BsCheckCircle className="shrink-0 text-emerald-500 text-xl" />
const QuestionIcon = () => <BsQuestionCircle className="shrink-0 text-violet-500 text-xl" />
const RrrIcon = () => <BsXCircle className="shrink-0 text-rose-500 text-xl" />
const DefaultIcon = () => <BsCircle className="shrink-0 text-neutral-500 text-xl" />

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
			className={`${background} w-full max-w-lg shadow-sm rounded-lg flex space-x-4 items-center px-4 py-2`}
		>
			<Icon />
			<div className="text-sm">{children}</div>
		</div>
	)
}
