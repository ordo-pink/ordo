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
  [Key in Language]?: Record<`@${Name}/${string}` | Name, string>
}

type ExtensionType = "command" | "association" | "parser" | "activity"

export type OrdoExtension<Name extends string> = {
  translations: TranslationRecord<Name>
  name: `ordo-${ExtensionType}-${Name}`
  storeSlice?: Slice
}

export type ParserRule = {
  validate: (line: string) => boolean
  extract: (line: string, root: RootNode) => void
}

export type OrdoCommandExtension<Name extends string> = OrdoExtension<Name> & {
  commands: OrdoCommand<Name>[]
}

export type OrdoActivityExtension<Name extends string> = OrdoCommandExtension<Name> &
  OrdoExtension<Name> & {
    sidebarComponent: Nullable<FC>
    workspaceComponent: FC
    icon: IconName
  }

export type OrdoAssociationExtension<Name extends string> = OrdoCommandExtension<Name> &
  OrdoExtension<Name> &
  OrdoParserExtension<Name> & {
    fileExtensions: `.${string}`[]
  }

export type OrdoParserExtension<Name extends string> = OrdoExtension<Name> & {
  name: `ordo-parser-${Name}`
  rules: ParserRule[]
}

export type ActionArgs = {
  currentFile: Nullable<OrdoFile>
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory>
  dispatch: ReturnType<typeof useAppDispatch>
}

export type OrdoCommand<Name extends string> = {
  accelerator?: string
  title: `@${Name}/${string}` | Name
  action: (state: ReturnType<typeof store.getState>, args: ActionArgs) => void
  icon?: IconName
  showInContextMenu?:
    | ExtensionContextMenuLocation
    | ((current: OrdoFile | OrdoDirectory) => boolean)
  showInCommandPalette?: boolean | ((current: Nullable<OrdoFile>) => boolean)
  hasElectronHanlders?: boolean
}
