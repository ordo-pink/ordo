import type { OrdoCommand } from "@core/types"

export type Menu = {
  children: OrdoCommand<string>[]
}
