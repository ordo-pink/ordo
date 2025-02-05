/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { create_auth_token } from "../../common/create-auth-token"
import { default_handler } from "../default.handler"
import { get_token_from_authorization_header } from "../../common/get-auth-token-from-authorization-header"
import { get_user_from_token } from "../../common/get-user-from-token"
import { persist_token } from "../../common/persist-token"
import { remove_token } from "../../common/remove-token"
import { verify_persisted_auth_token } from "../../common/verify-auth-token"

export const handle_refresh = default_handler(intake =>
	get_token_from_authorization_header(intake)
		.and(verify_persisted_auth_token(intake))
		.and(remove_token(intake))
		.and(get_user_from_token(intake))
		.and(create_auth_token(intake))
		.and(persist_token(intake))
		.and(({ jwt }) => void (intake.payload = jwt.token))
		.and(() => intake),
)
