import { SM_SCREEN_BREAKPOINT } from "@ordo-pink/core"
import { ZAGS } from "@ordo-pink/zags"

export const sidebar$ = ZAGS.Of<{ enabled: boolean; visible: boolean }>({
	enabled: false,
	visible: window.innerWidth >= SM_SCREEN_BREAKPOINT,
})
