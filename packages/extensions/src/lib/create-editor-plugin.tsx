import { Slice } from "@reduxjs/toolkit"
import { OrdoEditorPluginExtension } from "./types"

type Props<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> = Omit<
  OrdoEditorPluginExtension<Name, MemoryState, PersistedState>,
  "Component" | "Icon" | "name" | "storeSlice"
> & {
  storeSlice?: Slice<MemoryState>
}

export const createEditorPluginExtension = <
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, Record<`ordo-editor-plugin-${Name}`, MemoryState>, PersistedState>,
): OrdoEditorPluginExtension<Name, MemoryState, PersistedState> => ({
  ...props,
  name: `ordo-editor-plugin-${name}`,
  storeSlice:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.storeSlice as any) ??
    (null as unknown as OrdoEditorPluginExtension<Name, MemoryState, PersistedState>["storeSlice"]),
})
