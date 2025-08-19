import * as MAOKA_STYLED from "./maoka-styled.constants.ts"
import type * as Maoka from "../maoka/maoka.types.ts"

export type Tag = (typeof MAOKA_STYLED.HTML_TAGS)[number]

export type CreateStyledComponent = <$Args extends Maoka.BaseArgs | void = void>(
	classes?: string,
	f?: (args: Maoka.Args<$Args>) => void,
) => (args: $Args | Maoka.Kindergarten) => Maoka.Component

export type Instance = Record<Tag, CreateStyledComponent>
