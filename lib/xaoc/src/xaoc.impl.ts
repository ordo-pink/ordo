// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"

export type Key = boolean | number | bigint | string | symbol

const XaocMark = Symbol.for("xaoc")

export type XaocElementProps = {
	children: TElement[]
	key?: Key
	ref?: Subject<HTMLElement>
	[key: string]: any
}

export type XaocElement = {
	[XaocMark]: true
	name: string
	type: Function | string
	props: XaocElementProps
}

export type TElement = null | number | string | XaocElement | Array<XaocElement> | Observable<any>

export const isElement = (x: any): x is XaocElement => !!x[XaocMark]

export const h = (type: Function | string, props: Record<string, any> | null, ...children: any[]) =>
	Either.fromNullable(props)
		.leftMap(() => ({ children }))
		.map(props => ({ ...props, children }))
		.fold(
			props => toElement(type, props),
			props => toElement(type, props),
		)

const toElement = (type: Function | string, props: XaocElementProps): XaocElement => {
	const name = typeof type === "function" ? (type as any)["displayName"] ?? type.name : type
	return { name, [XaocMark]: true, props, type }
}
