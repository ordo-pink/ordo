// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren, JSX } from "react"
import {
	BsInfoCircle,
	BsQuestionCircle,
	BsXCircle,
	BsExclamationCircle,
	BsCheckCircle,
	BsCircle,
} from "react-icons/bs"
import { Switch } from "@ordo-pink/switch/mod"

type Props = {
	type?: "info" | "warn" | "error" | "success" | "question"
}

export const Callout = ({ type, children }: PropsWithChildren<Props>) => {
	let Icon!: () => JSX.Element
	let background!: string

	Switch.of(type)
		.case("info", () => {
			background = "bg-sky-100 dark:bg-sky-800"
			Icon = () => <BsInfoCircle className="shrink-0 text-sky-500 text-xl" />
		})
		.case("warn", () => {
			background = "bg-amber-100 dark:bg-amber-800"
			Icon = () => <BsExclamationCircle className="shrink-0 text-amber-500 text-xl" />
		})
		.case("success", () => {
			background = "bg-emerald-100 dark:bg-emerald-800"
			Icon = () => <BsCheckCircle className="shrink-0 text-emerald-500 text-xl" />
		})
		.case("question", () => {
			background = "bg-violet-100 dark:bg-violet-800"
			Icon = () => <BsQuestionCircle className="shrink-0 text-violet-500 text-xl" />
		})
		.case("error", () => {
			background = "bg-rose-100 dark:bg-rose-800"
			Icon = () => <BsXCircle className="shrink-0 text-rose-500 text-xl" />
		})
		.default(() => {
			background = "bg-neutral-200 dark:bg-neutral-600"
			Icon = () => <BsCircle className="shrink-0 text-neutral-500 text-xl" />
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
