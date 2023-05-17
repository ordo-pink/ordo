import type { BinaryFn, Nullable, UnaryFn } from "./types"

export type UserID = `${string}-${string}-${string}`

export enum Subscription {
  FREE = "free",
  PRO = "pro",
}

export type ExtensionID = string

export const ACHIEVEMENT_CATEGORIES = [
  "account",
  "collectibles",
  "duration",
  "usage",
  "collaboration",
  "hidden",
] as const

export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number]

export type SimpleAchievement = {
  grantedAt: Date
  extension: ExtensionID
  title: string
  description: string
  category: AchievementCategory
  hidden?: boolean
}

export type CompoundAchievement = SimpleAchievement & {
  steps?: SimpleAchievement[]
}

export type Achievement = SimpleAchievement | CompoundAchievement

export type UserDTO = {
  id: UserID
  firstName: string
  lastName: string
  subscription: Subscription
  driveSize: number
  maxUploadSize: number
  // TODO: extensions: ExtensionID[]
  // TODO: achievements: Achievement[]
  // TODO: Add OrdoSettings schema
  // TODO: settings: Record<ExtensionID, Schema>
  // TODO: permissions
}

export type UserCreateParams = Partial<UserDTO> & {
  id: UserID
}

export type UserDriver = {
  exists: UnaryFn<UserID, Promise<boolean>>
  create: UnaryFn<UserCreateParams, Promise<UserDTO>>
  get: UnaryFn<UserID, Promise<Nullable<UserDTO>>>
  update: BinaryFn<UserID, UserDTO, Promise<Nullable<UserDTO>>>
  remove: UnaryFn<UserID, Promise<Nullable<UserDTO>>>
}
