import { shell } from "electron"

import { registerMainHandlers } from "@main/register-main-handlers"

export default registerMainHandlers({
  "@reveal-in-files/open-in-file-explorer": (path: string) => shell.showItemInFolder(path),
})
