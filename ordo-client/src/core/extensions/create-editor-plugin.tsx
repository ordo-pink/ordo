import { Slice } from "@reduxjs/toolkit"

import { OrdoEditorPluginExtension } from "$core/types"

type Props<Name extends string, State extends Record<string, unknown>> = Omit<
  OrdoEditorPluginExtension<Name>,
  "Component" | "Icon" | "name" | "storeSlice"
> & {
  storeSlice?: Slice<State>
}

export const createEditorPluginExtension = <
  Name extends string,
  State extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, Record<`ordo-editor-plugin-${Name}`, State>>,
): OrdoEditorPluginExtension<Name, State> => ({
  ...props,
  name: `ordo-editor-plugin-${name}`,
  storeSlice:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.storeSlice as any) ?? (null as unknown as OrdoEditorPluginExtension<Name>["storeSlice"]),
})
