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

import { AppProps } from "next/app"
import { Jost } from "next/font/google"
import type { Metadata } from "next"

import "@ordo-pink/css/main.css"
import "./index.css"
import "../components/index-hero.css"


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
