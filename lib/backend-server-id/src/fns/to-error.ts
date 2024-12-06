/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { HttpError } from "@ordo-pink/rrr"

export const to_user_not_found_error = () => HttpError.NotFound("User not found")
export const to_user_already_exists_error = () => HttpError.Conflict("Email already taken")
export const to_invalid_request_error = () => HttpError.BadRequest("Invalid request")
export const to_same_email_error = () => HttpError.BadRequest("This is your current email")
export const to_invalid_body_error = () => HttpError.BadRequest("Invalid body")
export const to_password_mismatch_error = () => HttpError.BadRequest("Passwords do not match")
export const to_email_already_confirmed_error = () => HttpError.Conflict("Email already confirmed")
