// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	BsCheckCircle,
	BsCircle,
	BsExclamationCircle,
	BsInfoCircle,
	BsQuestionCircle,
	BsXCircle,
} from "react-icons/bs"

import { Switch } from "@ordo-pink/switch"

type Props = {
	type?: Client.Notification.Type
	children?: any
}

export default function Callout({ type, children }: Props) {
	const { Icon, background } = Switch.of(type)
		.case("info", () => ({
			background: "bg-sky-100 dark:bg-sky-800",
			Icon: () => <BsInfoCircle className="shrink-0 text-xl text-sky-500" />,
		}))
		.case("warn", () => ({
			background: "bg-amber-100 dark:bg-amber-800",
			Icon: () => <BsExclamationCircle className="shrink-0 text-xl text-amber-500" />,
		}))
		.case("success", () => ({
			background: "bg-emerald-100 dark:bg-emerald-800",
			Icon: () => <BsCheckCircle className="shrink-0 text-xl text-emerald-500" />,
		}))
		.case("question", () => ({
			background: "bg-violet-100 dark:bg-violet-800",
			Icon: () => <BsQuestionCircle className="shrink-0 text-xl text-violet-500" />,
		}))
		.case("rrr", () => ({
			background: "bg-rose-100 dark:bg-rose-800",
			Icon: () => <BsXCircle className="shrink-0 text-xl text-rose-500" />,
		}))
		.default(() => ({
			background: "bg-neutral-200 dark:bg-neutral-600",
			Icon: () => <BsCircle className="shrink-0 text-xl text-neutral-500" />,
		}))

	return (
		<div
			className={`flex w-full max-w-lg items-center space-x-4 rounded-lg px-4 py-2 shadow-sm ${background}`}
		>
			<Icon />
			<div className="text-sm">{children}</div>
		</div>
	)
}
