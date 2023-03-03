import i18next from "i18next"
import { ExtensionCreatorContext, ExtensionCreatorScopedContext, ExtensionModule } from "./types"

const scopeExtensionContextTo = (
  name: string,
  ctx: ExtensionCreatorContext,
): ExtensionCreatorScopedContext => ({
  ...ctx,
  registerTranslations: ctx.registerTranslations(name),
  translate: (key: string) => i18next.t(key, { ns: name }),
  // TODO: persistedStore
})

export const createExtension =
  (name: string, callback: (ctx: ExtensionCreatorScopedContext) => ExtensionModule) =>
  (ctx: ExtensionCreatorContext) => {
    return callback(scopeExtensionContextTo(name, ctx))
  }
