import type { Slice } from "@reduxjs/toolkit"
import type { Schema } from "jsonschema"
import type Loadable from "react-loadable"

import { AppState } from "$containers/app/types"

import type { Language } from "$core/constants/language"
import type { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ThunkFn<Result> = () => Result
export type UnaryFn<Arg, Result> = (arg: Arg) => Result
export type BinaryFn<Arg1, Arg2, Result> = (arg1: Arg1, arg2: Arg2) => Result
export type TernaryFn<Arg1, Arg2, Arg3, Result> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Result

export type Unpack<T> = T extends Array<infer U> ? U : T

export type Icon = ReturnType<typeof Loadable>
export type Component = ReturnType<typeof Loadable>

export type FileExtension = `.${string}`

export type FileAssociation = Record<OrdoExtensionName, FileExtension[]>

export type OrdoElectronEnv = {
  type: "electron"
}

export type OrdoBrowserEnv = {
  type: "browser"
}

export type AccessLevel = {
  read: boolean
  write: boolean
  erase: boolean
}

export type ActionContext = {
  state: AppState
  currentFile: Nullable<OrdoFile>
  contextMenuTarget: Nullable<OrdoFile | OrdoDirectory>
  dispatch: ReturnType<typeof useAppDispatch>
  env: OrdoElectronEnv | OrdoBrowserEnv
}

export type IsmParserRule = {
  validate: UnaryFn<string, boolean>
  extract: TernaryFn<string, object, object, void> // TODO Replace objects with Node and RootNode
}

export type OrdoCommand<ExtensionName extends string> = {
  icon?: Icon
  hotkey?: string
  title: `@${ExtensionName}/${string}`
  action: UnaryFn<ActionContext, void | PromiseLike<void>>
  showInContextMenu?: boolean | UnaryFn<OrdoFile | OrdoDirectory, boolean>
  showInCommandPalette?: boolean | UnaryFn<Nullable<OrdoFile>, boolean>
}

export type OrdoExtensionName<
  Name extends string = "",
  ExtensionType extends OrdoExtensionType = OrdoExtensionType,
> = `ordo-${ExtensionType}-${Name}`

export type TranslationsRecord<Name extends string> = {
  [Key in Language]?: Record<`@${Name}/${string}`, string>
}

// TODO: Restrict things, provide them via env
// @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy
// @see https://w3c.github.io/webappsec-permissions-policy/#permissions-policy-http-header-field
export type OrdoExtensionPermissions = Partial<{
  http: string[]
  clipboard: AccessLevel
  localStorage: Record<string, AccessLevel>
  cookies: Record<string, AccessLevel>
  filesystem: Record<string, AccessLevel>
  readSession: boolean
  indexDB: Record<string, AccessLevel>
}>

export interface OrdoExtension<Name extends string, ExtensionType extends OrdoExtensionType> {
  translations: TranslationsRecord<OrdoExtensionName<Name, ExtensionType>>
  name: OrdoExtensionName<Name, ExtensionType>
  readableName?: string
  overlayComponents?: Component[]
  description?: string
  storeSlice: Slice
  dependencies?: OrdoExtensionName[]
  permissions?: OrdoExtensionPermissions
}

export interface OrdoCommandExtension<Name extends string>
  extends OrdoExtension<Name, OrdoExtensionType.COMMAND> {
  commands: OrdoCommand<`ordo-command-${Name}`>[]
}

export interface OrdoIsmParserExtension<Name extends string>
  extends OrdoExtension<Name, OrdoExtensionType.ISM_PARSER> {
  rules: IsmParserRule[]
  Component: Component
}

export interface OrdoFileAssociationExtension<Name extends string>
  extends OrdoExtension<Name, OrdoExtensionType.FILE_ASSOCIATION> {
  fileExtensions: FileExtension[]
  Icon?: Icon
  Component: Component
}

export interface OrdoLocalSettingExtension<Name extends string>
  extends OrdoExtension<Name, OrdoExtensionType.LOCAL_SETTING> {
  schema: Schema
  peerAccess?: AccessLevel | boolean
  dependantAccess?: AccessLevel | boolean
}

export interface OrdoActivityExtension<Name extends string>
  extends OrdoExtension<Name, OrdoExtensionType.ACTIVITY> {
  paths?: string[]
  Icon: Icon
  Component: Component
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

export type WorkerMessageData<T = unknown> = {
  event: string
  payload: T
}
