import type { FC } from "react"
import type { IconName } from "@client/common/hooks/use-icon"
import type { RootNode } from "@client/editor/types"
import type { OrdoFile, OrdoDirectory } from "@core/app/types"

import { Slice } from "@reduxjs/toolkit"

import { store } from "@client/store"
import { useAppDispatch } from "@client/common/hooks/state-hooks"
import { ExtensionContextMenuLocation } from "@core/constants"
import { Language } from "@core/locales"

// TODO: Put types together
export type Nullable<T> = T | null

export type Optional<T> = T | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fn<Arguments = any, Result = void> = Arguments extends void
  ? () => Result
  : (arg: Arguments) => Result

export type UnaryFn<Arg, Result> = Fn<Arg, Result>

export type Unpack<T> = T extends Array<infer U> ? U : T

export type Thunk<T> = () => T

export type OrdoEvent<
  Scope extends string = string,
  Identifier extends string = string
> = `@${Scope}/${Identifier}`

type TranslationRecord<Name extends string> = {
  [Key in Language]?: Record<`@${Name}/${string}`, string>
}

export type OrdoExtension<
  Name extends string,
  Type extends "command" | "parser" | "association" | "activity"
> = {
  name: `ordo-${Type}-${Name}`
  translations: TranslationRecord<Name>
  store?: Slice
}

export type ParserRule = {
  validate: (line: string) => boolean
  extract: (line: string, root: RootNode) => void
}

export type OrdoCommandExtension<Name extends string> = OrdoExtension<Name, "command"> & {
  commands: OrdoCommand<Name>[]
}

export type OrdoActivityExtension<Name extends string> = OrdoCommandExtension<Name> &
  OrdoExtension<Name, "activity"> & {
    sidebarComponent: Nullable<FC>
    workspaceComponent: FC
    icon: IconName
  }

export type OrdoAssociationExtension<Name extends string> = OrdoCommandExtension<Name> &
  OrdoExtension<Name, "association"> &
  OrdoParserExtension<Name> & {
    fileExtensions: `.${string}`[]
  }

export type OrdoParserExtension<Name extends string> = OrdoExtension<Name, "parser"> & {
  rules: ParserRule[]
}

export type ActionArgs = {
  currentFile: Nullable<OrdoFile>
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory>
  dispatch: ReturnType<typeof useAppDispatch>
}

export type OrdoCommand<ExtensionName extends string> = {
  accelerator?: string
  title: `@${ExtensionName}/${string}`
  action: (state: ReturnType<typeof store.getState>, args: ActionArgs) => void
  icon?: IconName
  showInContextMenu?: ExtensionContextMenuLocation
  showInCommandPalette?: boolean
  hasElectronHanlders?: boolean
}
