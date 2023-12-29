// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Jost } from "next/font/google"
import type { Metadata } from "next"
import "@ordo-pink/css/main.css"
import "./index.css"
import "../components/index-hero.css"
import { AppProps } from "next/app"

const jost = Jost({ preload: true, subsets: ["latin-ext"], fallback: ["system-ui"] })

export const metadata: Metadata = {
	title: "Единое пространство для документов, файлов и проектов | Ordo",
	description:
		"Новый инструмент, объединяющий все ваши повседневные рабочие приложения в одно. Это универсальное рабочее пространство для вас и вашей команды.",
	icons: `${process.env.NEXT_PUBLIC_ORDO_STATIC_HOST}/favicon.ico`,
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={`bg-neutral-200 dark:bg-neutral-800 ${jost.className}`}>
			<Component {...pageProps} />
		</div>
	)
}
