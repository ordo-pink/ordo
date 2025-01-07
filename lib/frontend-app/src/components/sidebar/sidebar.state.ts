import { ZAGS } from "@ordo-pink/zags"

export const sidebar$ = ZAGS.Of<{ enabled: boolean; visible: boolean }>({ enabled: false, visible: true })
