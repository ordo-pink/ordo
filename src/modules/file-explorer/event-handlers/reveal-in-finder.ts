import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { FoldVoid } from "@utils/either";

/**
 * Show path in OS file manager. If payload is provided, payload path is used.
 * Current file path is used otherwise.
 */
export const handleRevealInFinder: OrdoEventHandler<"@file-explorer/reveal-in-finder"> = ({
  payload,
  context,
  transmission,
}) =>
  Either.fromNullable(payload)
    .map((path) => context.showInFolder(path))
    .swap()
    .chain(() => Either.fromNullable(transmission.select((state) => state.editor.currentTab)))
    .map((path) => context.showInFolder(path))
    .fold(...FoldVoid);
