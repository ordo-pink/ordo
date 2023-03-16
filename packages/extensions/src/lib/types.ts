import { Transformer } from "@lexical/markdown"
import { Nullable, ThunkFn, UnaryFn } from "@ordo-pink/common-types"
import { IOrdoFile, IOrdoDirectory, OrdoFileExtension } from "@ordo-pink/fs-entity"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { Slice } from "@reduxjs/toolkit"
import { TFunction } from "i18next"
import { TextNode, ElementNode, DecoratorNode } from "lexical"
import { ComponentType } from "react"
import { useDispatch } from "react-redux"
import { OrdoExtensionType } from "./ordo-extension-type"

export type OrdoExtensionName<
  Name extends string,
  ExtensionType extends OrdoExtensionType,
> = `ordo-${ExtensionType}-${Name}`

export type TranslationsRecord = {
  [Key in TwoLetterLocale]?: Record<string, string>
}

export type ActionContext<
  T extends OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  > = OrdoExtension<string, OrdoExtensionType, Record<string, unknown>, Record<string, unknown>>,
> = {
  state: ExtensionState<T>
  contextMenuTarget: Nullable<IOrdoFile | IOrdoDirectory>
  dispatch: ReturnType<typeof useDispatch>
  env: {
    type: "browser"
    fetch: typeof fetch
    openExternal: UnaryFn<string, void>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: UnaryFn<any, void>
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

export type OrdoCommand<ExtensionName extends string> = {
  Icon: ComponentType
  accelerator?: string
  title: `@${ExtensionName}/${string}`
  action: UnaryFn<ActionContext, void | PromiseLike<void>>
  showInContextMenu?: boolean | UnaryFn<ActionContext, boolean>
  showInCommandPalette?: boolean | UnaryFn<ActionContext, boolean>
}

export type ExtensionState<
  T extends OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
> = T extends OrdoExtension<string, OrdoExtensionType, infer U, Record<string, unknown>> ? U : null

export type ExtensionPersistedStore<
  T extends OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
> = T extends OrdoExtension<string, OrdoExtensionType, Record<string, unknown>, infer U>
  ? U extends Record<string, unknown>
    ? OrdoExtensionPersistedStore<U>
    : null
  : null

export type OrdoExtensionProps<
  T extends OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
> = {
  persistedStore: ExtensionPersistedStore<T>
  selector: () => null // TODO
  translate: () => null // TODO
}

export type OrdoExtensionPersistedStore<T extends Record<string, unknown>> = {
  init: ThunkFn<Promise<void>>
  get<K extends keyof T>(key: K): Promise<T[K]>
  set<K extends keyof T>(key: K, value: T[K]): Promise<void>
  clear: ThunkFn<Promise<void>>
  resetDefaults: ThunkFn<Promise<void>>
  getState: ThunkFn<Promise<T>>
  getDefaults: ThunkFn<Promise<T>>
}

export interface OrdoExtension<
  Name extends string,
  ExtensionType extends OrdoExtensionType,
  MemoryState extends Record<string, unknown> | undefined,
  PersistedState extends Record<string, unknown> | undefined,
  Nodes extends Array<TextNode | ElementNode | DecoratorNode<unknown>> = any[], // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  name: OrdoExtensionName<Name, ExtensionType>
  translations?: TranslationsRecord
  readableName?: string
  overlayComponents?: ComponentType[]
  description?: string
  storeSlice?: Slice<MemoryState>
  commands?: OrdoCommand<Name>[]
  editorPlugins?: ComponentType[]
  nodes?: Nodes
  transformers?: Transformer[]
  persistedState?: PersistedState
}

export type OrdoActivityProps<
  T extends OrdoActivityExtension<string, Record<string, unknown>, Record<string, unknown>>,
> = OrdoExtensionProps<T>

export type OrdoFileAssociationProps<
  T extends OrdoExtension<
    string,
    OrdoExtensionType,
    Record<string, unknown>,
    Record<string, unknown>
  >,
> = OrdoExtensionProps<T> & {
  file: IOrdoFile
}

export interface OrdoCommandExtension<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> extends OrdoExtension<Name, OrdoExtensionType.COMMAND, MemoryState, PersistedState> {
  commands: OrdoCommand<Name>[]
}

export interface OrdoEditorPluginExtension<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> extends OrdoExtension<Name, OrdoExtensionType.EDITOR_PLUGIN, MemoryState, PersistedState> {
  editorPlugins: ComponentType[]
}

export interface OrdoFileAssociationExtension<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedStateState extends Record<string, unknown>,
> extends OrdoExtension<
    Name,
    OrdoExtensionType.FILE_ASSOCIATION,
    MemoryState,
    PersistedStateState
  > {
  fileExtensions: OrdoFileExtension[]
  Icon: ComponentType
  Component: ComponentType
}

export interface OrdoActivityExtension<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> extends OrdoExtension<Name, OrdoExtensionType.ACTIVITY, MemoryState, PersistedState> {
  routes: string[]
  accelerator?: string
  Icon: ComponentType
  Component: ComponentType
  persistedState?: PersistedState
}
