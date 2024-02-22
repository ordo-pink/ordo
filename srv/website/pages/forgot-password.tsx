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

import Head from "next/head"
import { Centered } from "../components/centered"
import { PageHeader } from "../components/page-header"
import { OrdoRoutes } from "@ordo-pink/ordo-routes"

export default function ForgotPasswordPage() {
	return (
		<Centered centerX centerY screenHeight>
			<Head>
				<title>Ordo.pink | Восстановление пароля</title>
			</Head>

			<PageHeader text="Это пока не работает" />
			<p>
				Но потом заработает, конечно. А пока, можно написать{" "}
				<a rel="noreferrer noopener" href={telegramSupportURL}>
					нам в поддержку в Telegram
				</a>
				, поможем в ручном порядке.
			</p>
		</Centered>
	)
}

// --- Internal ---

const telegramSupportURL = OrdoRoutes.External.TelegramSupportCIS.prepareRequest({ host: "" }).url
