// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PropsWithChildren } from "react"
import {
	BsInfoCircle,
	BsQuestionCircle,
	BsXCircle,
	BsExclamationCircle,
	BsCheckCircle,
	BsCircle,
} from "react-icons/bs"
import { Switch } from "@ordo-pink/switch"

type Props = {
	type?: Client.Notification.Type
}

export const Callout = ({ type, children }: PropsWithChildren<Props>) => {
	const { Icon, background } = Switch.of(type)
		.case("info", () => ({
			background: "bg-sky-100 dark:bg-sky-800",
			Icon: () => <BsInfoCircle className="text-xl text-sky-500 shrink-0" />,
		}))
		.case("warn", () => ({
			background: "bg-amber-100 dark:bg-amber-800",
			Icon: () => <BsExclamationCircle className="text-xl text-amber-500 shrink-0" />,
		}))
		.case("success", () => ({
			background: "bg-emerald-100 dark:bg-emerald-800",
			Icon: () => <BsCheckCircle className="text-xl text-emerald-500 shrink-0" />,
		}))
		.case("question", () => ({
			background: "bg-violet-100 dark:bg-violet-800",
			Icon: () => <BsQuestionCircle className="text-xl text-violet-500 shrink-0" />,
		}))
		.case("rrr", () => ({
			background: "bg-rose-100 dark:bg-rose-800",
			Icon: () => <BsXCircle className="text-xl text-rose-500 shrink-0" />,
		}))
		.default(() => ({
			background: "bg-neutral-200 dark:bg-neutral-600",
			Icon: () => <BsCircle className="text-xl shrink-0 text-neutral-500" />,
		}))

	return (
		<div
			className={`flex items-center px-4 py-2 space-x-4 w-full max-w-lg rounded-lg shadow-sm ${background}`}
		>
			<Icon />
			<div className="text-sm">{children}</div>
		</div>
	)
}
