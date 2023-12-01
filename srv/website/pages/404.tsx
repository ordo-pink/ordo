// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Link from "next/link"
import { Centered } from "../components/centered"

export default function ForgotPasswordPage() {
	return (
		<Centered centerX centerY screenHeight>
			<h1 className="text-9xl font-black">404</h1>
			<p>
				Мы не та самая компания, у нас не всё найдётся. <Link href="/">Пойти домой</Link>.
			</p>
		</Centered>
	)
}
