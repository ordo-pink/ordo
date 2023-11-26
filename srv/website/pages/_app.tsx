// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Jost } from "next/font/google"
import type { Metadata } from "next"
import "@ordo-pink/css/main.css"
import "./index.css"
import "../components/index-hero.css"
import { AppProps } from "next/app"

const jost = Jost({ preload: true, subsets: ["latin"], fallback: ["system-ui"] })

export const metadata: Metadata = {
	title: "Ordo.pink",
	description: "Безопасное, надёжное и гибкое облачное хранилище нового поколения.",
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={jost.className}>
			<Component {...pageProps} />
		</div>
	)
}
