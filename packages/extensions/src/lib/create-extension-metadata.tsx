import { OrdoExtensionType } from "./ordo-extension-type"
import { OrdoExtensionName, OrdoExtensionPersistedStore } from "./types"

const extensionMetadata = <T extends Record<string, unknown>>(
  name: OrdoExtensionName<string, OrdoExtensionType>,
  persistedState: T,
): OrdoExtensionPersistedStore<T> => {
  const store = { ...persistedState }

  return {
    init: async () => {
      // try {
      //   const json = await window.ordo.api.extensions.get(name)
      //   store = json
      // } catch (e) {
      //   await window.ordo.api.extensions.create({
      //     name,
      //     content: persistedState,
      //   })
      //   const json = await window.ordo.api.extensions.get(name)
      //   store = json
      // }
    },
    get: (key) => Promise.resolve(store[key]),
    set: (key, value) => {
      store[key] = value

      return Promise.resolve()

      // return window.ordo.api.extensions.update({ name, content: store }).then(() => void 0)
    },
    clear: () => {
      // return window.ordo.api.extensions.remove(name).then(() => {
      //   store = {} as T
      // })
    },
    getDefaults: () => Promise.resolve(persistedState),
    getState: () => Promise.resolve(store),
    resetDefaults: async () => {
      // store = { ...persistedState }
      // await window.ordo.api.extensions.update({ name, content: store })
    },
  }
}

export const createExtensionPersistedState = <T extends Record<string, unknown>>(
  name: OrdoExtensionName<string, OrdoExtensionType>,
  defaultMetadata?: T,
) => (defaultMetadata ? extensionMetadata(name, defaultMetadata) : undefined)
