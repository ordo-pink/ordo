import { OrdoExtensionMetadata, OrdoExtensionName } from "$core/types"

const extensionMetadata = <T extends Record<string, unknown>>(
  name: OrdoExtensionName,
  metadata: T,
): OrdoExtensionMetadata<T> => {
  let store = { ...metadata }

  return {
    init: async () => {
      try {
        const json = await window.ordo.api.extensions.get(name)

        store = json
      } catch (e) {
        await window.ordo.api.extensions.create({
          name,
          content: metadata,
        })
        const json = await window.ordo.api.extensions.get(name)

        store = json
      }
    },
    get: (key) => Promise.resolve(store[key]),
    set: (key, value) => {
      store[key] = value

      return window.ordo.api.extensions.update({ name, content: store }).then(() => void 0)
    },
    clear: () => {
      return window.ordo.api.extensions.remove(name).then(() => {
        store = {} as T
      })
    },
    getDefaults: () => Promise.resolve(metadata),
    getState: () => Promise.resolve(store),
    resetDefaults: async () => {
      store = { ...metadata }

      await window.ordo.api.extensions.update({ name, content: store })
    },
  }
}

export const createExtensionMetadata = <T extends Record<string, unknown>>(
  name: OrdoExtensionName,
  defaultMetadata?: T,
) => (defaultMetadata ? extensionMetadata(name, defaultMetadata) : undefined)
