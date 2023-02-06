import { OrdoExtensionMetadata } from "$core/types"

const extensionMetadata = <T extends Record<string, unknown>>(
  metadata: T,
  defaultMetadata: T = { ...metadata },
): OrdoExtensionMetadata<T> => ({
  get: (key) => Promise.resolve(metadata[key]),
  set: (key, value) => {
    metadata[key] = value
    return Promise.resolve()
  },
  clear: () => {
    metadata = {} as T
    return Promise.resolve()
  },
  getDefaults: () => Promise.resolve(defaultMetadata),
  getState: () => Promise.resolve(metadata),
  resetDefaults: () => {
    metadata = { ...defaultMetadata }
    return Promise.resolve()
  },
})

export const createExtensionMetadata = <T extends Record<string, unknown>>(defaultMetadata: T) =>
  extensionMetadata({ ...defaultMetadata })
