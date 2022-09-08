import { OrdoEventHandler } from "@core/types";
import { fromBoolean } from "@utils/either";
import { FoldVoid } from "@utils/functions";
import { Either } from "or-else";

export const handleUpdateCaretPositions: OrdoEventHandler<"@editor/update-caret-positions"> = ({ draft, payload }) =>
  Either.fromNullable(draft.editor.currentTab)
    .chain((ctp) => Either.fromNullable(draft.editor.tabs.find((t) => t.path === ctp)))
    .chain((ct) => Either.fromNullable(payload).map((ps) => void (ct.caretPositions = ps)))
    .chain(() => fromBoolean(draft.editor.focused).leftMap(() => void (draft.editor.focused = true)))
    .fold(...FoldVoid);
