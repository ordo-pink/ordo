// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Centered } from "../components/centered"
import { PageHeader } from "../components/page-header"
import { useEffect } from "react"

export default function ForgotPasswordPage() {
	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_ID_HOST}/sign-out`, {
			method: "POST",
			credentials: "include",
		}).then(() => {
			window.location.replace("/")
		})
	}, [])

	return (
		<Centered centerX centerY screenHeight>
			<PageHeader text="Выходим..." />
		</Centered>
	)
}
