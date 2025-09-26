/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "../maoka.types"
import type * as MaokaStyled from "./maoka-styled.types"
import * as STYLED from "./maoka-styled.constants"
import * as jabs from "../dom/jabs/maoka-jabs.impl"
import * as maoka from "../maoka.impl"

const tags: MaokaStyled.Instance = STYLED.HTML_TAGS.reduce(
	(acc, tag) => ({
		...acc,
		[tag]:
			<$Args extends Maoka.BaseArgs | void = void>(
				classes?: string,
				on_create?: (args: Maoka.Args<$Args> | Maoka.Kindergarten) => void,
			) =>
			(args: $Args) =>
				maoka.create_component<$Args>(tag, args => {
					if (classes) args.use(jabs.if_dom(n => n.value.setAttribute("class", classes)))
					on_create && on_create(args as any)

					return args.kindergarten
				})(args),
	}),
	{} as MaokaStyled.Instance,
)

export default tags
