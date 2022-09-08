import React, { useRef, useEffect, useState } from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { tail } from "@utils/array";
import { RangeDirection } from "../constants";

export const Lines = React.memo(
  () => {
    const dispatch = useAppDispatch();
    const refLines = useRef(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const current = useCurrentTab();
    const focused = useAppSelector((state) => state.editor.focused);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!current.tab || !focused) {
        return;
      }

      const { key, shiftKey, altKey, ctrlKey, metaKey } = e;

      if (key === " ") {
        e.preventDefault();
      }

      if (key === "Tab" && focused) {
        dispatch({ type: "@editor/unfocus" });
        return;
      }

      dispatch({
        type: "@editor/handle-typing",
        payload: {
          path: current.tab?.path,
          event: { key, shiftKey, altKey, ctrlKey, metaKey },
        },
      });
    };

    const handleClick = (e: React.MouseEvent) =>
      Either.fromNullable(current.tab)
        .chain((t) =>
          Either.right(e)
            .map(tapPreventDefault)
            .map(tapStopPropagation)
            .map(() => t.content)
            .chain((c) => Either.fromNullable(tail(c.children).range.end))
            .map((position) => [{ start: position, end: position, direction: RangeDirection.LEFT_TO_RIGHT }])
            .map((payload) => dispatch({ type: "@editor/update-caret-positions", payload })),
        )
        .fold(...FoldVoid);

    const removeKeyDownListener = () => window.removeEventListener("keydown", handleKeyDown);

    React.useEffect(() => {
      if (current.tab && focused) {
        window.addEventListener("keydown", handleKeyDown);
      }

      return () => removeKeyDownListener();
    }, [current.tab, focused]);

    useEffect(() => {
      if (!refLines.current) return;
      const linesComponent = refLines.current as HTMLDivElement;
      const scrollHeight = linesComponent.scrollHeight;
      const clientHeight = linesComponent.clientHeight;
      const currentScrollHeight = scrollHeight - prevScrollHeight;

      if (scrollHeight > clientHeight) {
        linesComponent.scrollBy({ top: currentScrollHeight });
        setPrevScrollHeight(scrollHeight);
      }
    }, [current.tab]);

    return current.tab ? (
      <div className="h-[calc(100vh-9rem)] overflow-auto" ref={refLines} onClick={handleClick}>
        {current.tab.content.children.map((_, lineIndex) => (
          <Line key={`${lineIndex}`} lineIndex={lineIndex} />
        ))}
      </div>
    ) : null;
  },
  () => true,
);
