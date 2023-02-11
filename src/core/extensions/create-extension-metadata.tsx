import { OrdoExtensionMetadata } from "$core/types"

const extensionMetadata = <T extends Record<string, unknown>>(
  name: string,
  metadata: T,
): OrdoExtensionMetadata<T> => {
  let store = { ...metadata }

  return {
    init: async () => {
      try {
        const json = await window.ordo.api.fs.files
          .getRaw(`/extensions/${name}.json`)
          .then((res) => res.json())
        store = json
      } catch (e) {
        await window.ordo.api.fs.files.create({
          path: `/extensions/${name}.json`,
          content: JSON.stringify(metadata),
        })
        const json = await window.ordo.api.fs.files
          .getRaw(`/extensions/${name}.json`)
          .then((res) => res.json())
        store = json
      }
    },
    get: (key) => Promise.resolve(store[key]),
    set: (key, value) => {
      store[key] = value

      return window.ordo.api.fs.files
        .update({
          path: `/extensions/${name}.json`,
          content: JSON.stringify(store),
        })
        .then(() => void 0)
    },
    clear: () => {
      return window.ordo.api.fs.files.remove(`/extensions/${name}.json`).then(() => {
        store = {} as T
      })
    },
    getDefaults: () => Promise.resolve(metadata),
    getState: () => Promise.resolve(store),
    resetDefaults: async () => {
      store = { ...metadata }

      await window.ordo.api.fs.files.update({
        path: `/extensions/${name}.json`,
        content: JSON.stringify(store),
      })
    },
  }
}

export const createExtensionMetadata = <T extends Record<string, unknown>>(
  name: string,
  defaultMetadata?: T,
) => (defaultMetadata ? extensionMetadata(name, defaultMetadata) : undefined)
