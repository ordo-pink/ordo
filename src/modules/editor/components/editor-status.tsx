import React from "react";
import { useTranslation } from "react-i18next";

import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { RangeDirection } from "@modules/editor/constants";

export const EditorStatus = () => {
  const dispatch = useAppDispatch();

  const current = useCurrentTab();

  const Code = useIcon("HiOutlineCode");

  const { t } = useTranslation();

  const handleClick = () => dispatch({ type: "@top-bar/open-go-to-line" });

  return (
    current.tab && (
      <div className="status-bar_item" onClick={handleClick}>
        <Code />
        <div className="flex space-x-2">
          {current.tab.caretPositions.map((position, index) => {
            const direction = position.direction === RangeDirection.LEFT_TO_RIGHT ? "end" : "start";

            return (
              <div
                key={`${position[direction].line}-${position[direction].character}`}
                title={t("status-bar.caret-position.title", {
                  charNumber: position[direction].character,
                  lineNumber: position[direction].line,
                })}
                className=""
              >
                {position[direction].line}:{position[direction].character}
                {index !== current.tab!.caretPositions.length - 1 ? "," : ""}
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
