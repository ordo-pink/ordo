import {
  IOrdoDirectory,
  IOrdoFile,
  Language,
  Nullable,
  OrdoExtensionType,
  OrdoFileExtension,
  ThunkFn,
  UnaryFn,
} from "@ordo-pink/core"
import type { Slice } from "@reduxjs/toolkit"
import type { TFunction } from "i18next"
import type { ComponentType } from "react"
import type { LoadableComponent } from "react-loadable"

import type { router } from "$core/router"
import type { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import type { RootState } from "$core/state/types"

export type OrdoExtensionPersistedStore<T extends Record<string, unknown>> = {
  init: ThunkFn<Promise<void>>
  get<K extends keyof T>(key: K): Promise<T[K]>
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>
  clear: ThunkFn<Promise<void>>
  resetDefaults: ThunkFn<Promise<void>>
  getState: ThunkFn<Promise<T>>
  getDefaults: ThunkFn<Promise<T>>
}

export type OrdoLoadableComponent<T = Record<string, unknown>> = ComponentType<T> &
  LoadableComponent

export type OrdoExtensionProps<T extends OrdoExtension<string, OrdoExtensionType>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  persistedStore: T extends OrdoExtension<string, OrdoExtensionType, Record<string, any>, infer U>
    ? OrdoExtensionPersistedStore<U>
    : null
  selector: () => null // TODO
  translate: () => null // TODO
}

export type OrdoActivityProps<T extends OrdoExtension<string, OrdoExtensionType>> =
  OrdoExtensionProps<T>

export type OrdoFileAssociationProps<T extends OrdoExtension<string, OrdoExtensionType>> =
  OrdoExtensionProps<T> & {
    file: IOrdoFile
  }

export type ActionContext<
  T extends OrdoExtension<string, OrdoExtensionType> = OrdoExtension<string, OrdoExtensionType>,
> = {
  state: RootState<
    T extends OrdoExtension<string, OrdoExtensionType, infer U> ? U : Record<string, unknown>
  >
  contextMenuTarget: Nullable<IOrdoFile | IOrdoDirectory>
  dispatch: ReturnType<typeof useAppDispatch>
  env: typeof window.ordo.env
  navigate: typeof router.navigate
  translate: TFunction<"translation", undefined>
  isAuthenticated: boolean
  createLoginUrl: ThunkFn<string>
  createRegisterUrl: ThunkFn<string>
  userData?: {
    email: string
    username: string
    emailVerified: boolean
  }
}

export type ExtensionState<T extends OrdoExtension<string, OrdoExtensionType>> =
  T extends OrdoExtension<string, OrdoExtensionType, infer U> ? U : null

export type OrdoCommand<ExtensionName extends string> = {
  Icon: OrdoLoadableComponent
  accelerator?: string
  title: `@${ExtensionName}/${string}`
  action: UnaryFn<ActionContext, void | PromiseLike<void>>
  showInContextMenu?: boolean | UnaryFn<IOrdoFile | IOrdoDirectory, boolean>
  showInCommandPalette?: boolean | UnaryFn<ActionContext, boolean>
}

export type OrdoExtensionName<
  Name extends string = "",
  ExtensionType extends OrdoExtensionType = OrdoExtensionType,
> = `ordo-${ExtensionType}-${Name}`

export type TranslationsRecord = {
  [Key in Language]?: Record<string, string>
}

export interface OrdoExtension<
  Name extends string = string,
  ExtensionType extends OrdoExtensionType = OrdoExtensionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MemoryState extends Record<string, any> = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PersistedState extends Record<string, any> = Record<string, any>,
> {
  name: OrdoExtensionName<Name, ExtensionType>
  translations?: TranslationsRecord
  readableName?: string
  overlayComponents?: OrdoLoadableComponent[]
  description?: string
  storeSlice?: Slice<MemoryState>
  commands?: OrdoCommand<Name>[]
  persistedState?: PersistedState
}

export interface OrdoCommandExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
> extends OrdoExtension<Name, OrdoExtensionType.COMMAND, TState> {
  commands: OrdoCommand<Name>[]
}

export interface OrdoEditorPluginExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
> extends OrdoExtension<Name, OrdoExtensionType.EDITOR_PLUGIN, TState> {
  plugins: ComponentType[]
}

export interface OrdoFileAssociationExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
> extends OrdoExtension<Name, OrdoExtensionType.FILE_ASSOCIATION, TState> {
  fileExtensions: OrdoFileExtension[]
  Icon?: OrdoLoadableComponent
  Component: OrdoLoadableComponent
}

export interface OrdoActivityExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PersistedState extends Record<string, any> = Record<string, any>,
> extends OrdoExtension<Name, OrdoExtensionType.ACTIVITY, TState, PersistedState> {
  routes: string[]
  accelerator?: string
  Icon: OrdoLoadableComponent
  Component: OrdoLoadableComponent
  persistedState?: PersistedState
}
