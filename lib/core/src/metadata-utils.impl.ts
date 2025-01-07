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

import { first_matched, negate } from "@ordo-pink/tau"

import { is_label, is_link } from "./metadata-validations.impl"

// TODO Move to frontend-app
type TGetWrongLabelFn = (labels: Ordo.Metadata.Label[]) => Ordo.Metadata.Label | undefined
export const get_wrong_label: TGetWrongLabelFn = first_matched<Ordo.Metadata.Label>(negate(is_label))

type TGetWrongLinkFn = (links: Ordo.Metadata.FSID[]) => Ordo.Metadata.FSID | undefined
export const get_wrong_link: TGetWrongLinkFn = first_matched<Ordo.Metadata.FSID>(negate(is_link))
