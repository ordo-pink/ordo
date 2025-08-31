/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as MAOKA_STYLED from "./maoka-styled.constants.ts"
import type * as Maoka from "../maoka.types.ts"

export type Tag = (typeof MAOKA_STYLED.HTML_TAGS)[number]

export type CreateStyledComponent = <$Args extends Maoka.BaseArgs | void = void>(
	classes?: string,
	f?: (args: Maoka.Args<$Args>) => void,
) => (args: $Args | Maoka.Kindergarten) => Maoka.Component

export type Instance = Record<Tag, CreateStyledComponent>
