import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { Lines } from "@modules/editor/components/lines";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { tail } from "@utils/array";
import { RangeDirection } from "../constants";

export const TextEditor: React.FC = React.memo(
  () => {
    const dispatch = useAppDispatch();

    const current = useCurrentTab();

    const handleClick = (e: React.MouseEvent) =>
      current.tab &&
      Either.right(e)
        .map(tapPreventDefault)
        .map(tapStopPropagation)
        .map(() => dispatch({ type: "@editor/focus" }))
        .map(() => ({
          line: tail(current.tab!.content.children).range.end.line,
          character: tail(current.tab!.content.children).range.end.character,
        }))
        .map((position) => [{ start: position, end: position, direction: RangeDirection.LEFT_TO_RIGHT }])
        .map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
        .fold(...FoldVoid);

    return current.tab ? (
      <div>
        <Breadcrumbs />
        <div className="editor_textarea" onClick={handleClick}>
          <Lines />
        </div>
      </div>
    ) : null;
  },
  () => true,
);
