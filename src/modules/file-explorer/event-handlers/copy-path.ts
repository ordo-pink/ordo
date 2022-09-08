import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { FoldVoid } from "@utils/functions";

/**
 * Put path to clipboard. If payload is provided, payload path is used. Current file path is used otherwise.
 */
export const handleCopyPath: OrdoEventHandler<"@file-explorer/copy-path"> = ({ transmission, payload, context }) =>
  Either.fromNullable(payload)
    .map((path) => context.toClipboard(path))
    .swap()
    .chain(() => Either.fromNullable(transmission.select((state) => state.editor.currentTab)))
    .map((path) => context.toClipboard(path))
    .fold(...FoldVoid);
