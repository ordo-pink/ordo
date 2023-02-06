import type { EditorPlugin } from "@draft-js-plugins/editor"
import type { Slice } from "@reduxjs/toolkit"
import type { TFunction } from "i18next"
import type { ComponentType } from "react"
import type { LoadableComponent } from "react-loadable"

import type { Language } from "$core/constants/language"
import type { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import type { router } from "$core/router"
import type { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import type { RootState } from "$core/state/types"

export type Nullable<T> = T | null

export type OrdoExtensionMetadata<T extends Record<string, unknown>> = {
  init: ThunkFn<Promise<void>>
  get<K extends keyof T>(key: K): Promise<T[K]>
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>
  clear: ThunkFn<Promise<void>>
  resetDefaults: ThunkFn<Promise<void>>
  getState: ThunkFn<Promise<T>>
  getDefaults: ThunkFn<Promise<T>>
}

export type Optional<T> = T | undefined

export type ThunkFn<Result> = () => Result
export type UnaryFn<Arg, Result> = (arg: Arg) => Result
export type BinaryFn<Arg1, Arg2, Result> = (arg1: Arg1, arg2: Arg2) => Result
export type TernaryFn<Arg1, Arg2, Arg3, Result> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Result

export type Unpack<T> = T extends Array<infer U> ? U : T

export type OrdoLoadableComponent<T = Record<string, unknown>> = ComponentType<T> &
  LoadableComponent

export type FileExtension = string

export type FileAssociation = Record<OrdoExtensionName, FileExtension[]>

export type OrdoExtensionProps<
  TMetadata extends Record<string, unknown> = Record<string, unknown>,
> = {
  metadata: OrdoExtensionMetadata<TMetadata>
}

export type ActionContext<
  T extends OrdoExtension<string, OrdoExtensionType> = OrdoExtension<string, OrdoExtensionType>,
> = {
  state: RootState<
    T extends OrdoExtension<string, OrdoExtensionType, infer U> ? U : Record<string, unknown>
  >
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory>
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
  showInContextMenu?: boolean | UnaryFn<OrdoFile | OrdoDirectory, boolean>
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
  Name extends string,
  ExtensionType extends OrdoExtensionType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  name: OrdoExtensionName<Name, ExtensionType>
  translations?: TranslationsRecord
  readableName?: string
  overlayComponents?: OrdoLoadableComponent[]
  description?: string
  storeSlice?: Slice<TState>
  commands?: OrdoCommand<Name>[]
  metadata?: TMetadata
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
  plugins: EditorPlugin[]
}

export interface OrdoFileAssociationExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
> extends OrdoExtension<Name, OrdoExtensionType.FILE_ASSOCIATION, TState> {
  fileExtensions: FileExtension[]
  Icon?: OrdoLoadableComponent
  Component: OrdoLoadableComponent
}

export interface OrdoActivityExtension<
  Name extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TState extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, unknown> = Record<string, unknown>,
> extends OrdoExtension<Name, OrdoExtensionType.ACTIVITY, TState> {
  routes: string[]
  accelerator?: string
  Icon: OrdoLoadableComponent
  Component: OrdoLoadableComponent<{ metadata?: OrdoExtensionMetadata<TMetadata> }>
  metadata?: TMetadata
}

export type OrdoFile<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: string
  readableName: string
  extension: FileExtension
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  size: number
  metadata: Metadata
}

export type OrdoDirectory<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: string
  readableName: string
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  children: Array<OrdoFile | OrdoDirectory>
  metadata: Metadata
}
