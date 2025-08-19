/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Tag } from "../styled/maoka-styled.types.ts"

/** Internal id. You probably won't need it. Created with {@link CreateId root.create_id}. */
export type Id = string | number

/** Node type guard. Only returns `true` if node was created by maoka. */
export type NodeGuard<$Value = unknown> = (x: any) => x is Node<$Value>

/** Component type guard. Only returns `true` if component was created by maoka. */
export type ComponentGuard = (x: any) => x is Component

/** Maoka tree node. Accepts value definition (e.g. `HTMLElement` for `maoka-dom`). */
export type Node<$Value = unknown> = { id: Id; kindergarten: Kindergarten | void; root: Root<$Value>; value: $Value }

/** A union of stuff the component may return. */
export type Child = null | void | string | number | Node | Component
export type Children = Child | Child[]

/** Maoka jab is like react hook, just more straightforward 🤡 */
export type Jab<$Return = void> = (args: Args) => $Return

/** Unified interface for jabbing your components. */
export type Use = <$Return = void>(jab: Jab<$Return>) => $Return

/** A legal way to pass children to another component and get some rest. */
export type Kindergarten = () => Children | Promise<Children>

/** Should create a unique {@link Id id}. Mostly used internally. */
export type CreateId = () => Id

/** Create a value in the current render context for given tag (e.g. `HTMLElement` in `maoka-dom`). */
export type CreateValue<$Value = unknown> = (tag: string) => $Value

/** Empty component args. */
export type BaseArgs = Record<string, unknown> & { kindergarten?: Kindergarten }

/** Extensible component args that you can provide to a component. */
export type Args<$Args extends BaseArgs | void = void> = $Args extends void
	? { use: Use; node: Node; kindergarten?: Kindergarten }
	: $Args & { use: Use; node: Node; kindergarten?: Kindergarten }

/** Callback function accepted by {@link CreateComponent}. Put your code here. */
export type Fn<$Args extends BaseArgs | void = void> = (args: Args<$Args>) => Kindergarten | Promise<Kindergarten> | void

/** Maoka root node. */
export type Root<$Value = unknown> = { id: Id; create_id: CreateId; create_value: CreateValue<$Value> }

/** Maoka component is in fact a lazy node waiting for the root to grow. */
export type Component = (root: Root) => Node | Promise<Node>

/** Create a maoka component. */
export type CreateComponent = <$Args extends BaseArgs | void = void>(
	/** Tag name. */
	tag: Tag | (string & {}),
	/** {@link Fn Callback function} where you put your component code. */
	f: Fn<Args<$Args>>,
) => (args: $Args | Kindergarten) => Component
