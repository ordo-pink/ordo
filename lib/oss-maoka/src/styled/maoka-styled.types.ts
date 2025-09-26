/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "../maoka.types"
import type * as STYLED from "./maoka-styled.constants"

export type Tag = (typeof STYLED.HTML_TAGS)[number]

export type Create = <$Args extends Maoka.BaseArgs | void = void>(
	classes?: string,
	f?: (args: Maoka.Args<$Args>) => void,
) => (args: $Args | Maoka.Kindergarten) => Maoka.Component

export type Instance = Record<Tag, Create>
