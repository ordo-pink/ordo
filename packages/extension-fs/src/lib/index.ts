import { createExtension } from "@ordo-pink/stream-extensions"

export default createExtension("fs", ({ listenCommand }) => {
  listenCommand("router.navigate", console.log)
})
