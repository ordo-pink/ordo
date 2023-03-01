import { ExtensionCreatorContext, ExtensionModule } from "./types"

const scopeExtensionContextTo = (
  name: string,
  ctx: ExtensionCreatorContext,
): ExtensionCreatorContext => ctx

export const createExtension =
  (name: string, callback: (ctx: ExtensionCreatorContext) => ExtensionModule) =>
  (ctx: ExtensionCreatorContext) => {
    return callback(scopeExtensionContextTo(name, ctx))
  }
