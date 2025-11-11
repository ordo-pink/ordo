/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Dom from "../maoka-dom.types.ts"
import type * as Maoka from "../../maoka.types.ts"

export type IfDOM = <$Element extends HTMLElement = HTMLElement, $Return = void>(
	f: (node: Dom.DomNode<$Element>) => $Return,
) => Maoka.Jab<$Return | void>

export type OnUnmount = (f: (node: Dom.DomNode) => ReturnType<Dom.DomOnUnmountHandler>) => Maoka.Jab

export type OnMount = (f: (node: Dom.DomNode) => ReturnType<Dom.DomOnMountHandler>) => Maoka.Jab
