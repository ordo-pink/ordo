/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Node, OnMountHandler, OnUnmountHandler } from "../dom/maoka-dom.types.ts"
import type { Jab } from "../maoka.types.ts"

export type IfDOM = <$Element extends HTMLElement = HTMLElement, $Return = void>(
	f: (node: Node<$Element>) => $Return,
) => Jab<$Return | void>

export type OnUnmount = (f: (node: Node) => ReturnType<OnUnmountHandler>) => Jab

export type OnMount = (f: (node: Node) => ReturnType<OnMountHandler>) => Jab

export type Refresh$ = Jab

export type SetAttribute = (name: string, value: string | undefined) => Jab
