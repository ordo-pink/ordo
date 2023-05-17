import { UnaryFn } from "./types"

export type GlobalStatsDTO = {
  totalFiles: number
  totalDirectories: number
  totalUsers: number
  totalExtensions: number
  totalFreeAccounts: number
  totalProAccounts: number
  totalSizeGB: number
}

export type GlobalStatsDriver = {
  increment: UnaryFn<keyof GlobalStatsDTO, Promise<GlobalStatsDTO>>
  decrement: UnaryFn<keyof GlobalStatsDTO, Promise<GlobalStatsDTO>>
}
