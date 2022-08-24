import React from "react";
import { useTranslation } from "react-i18next";

import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

import "@containers/status-bar/index.css";
import { Notifications } from "@modules/notifications";

/**
 * StatusBar is a wrapper component for custom informative views and Notifications.g
 * TODO: Extract Caret Position component to Editor module.
 */
export const StatusBar: React.FC = () => {
  const dispatch = useAppDispatch();

  const current = useCurrentTab();

  const Code = useIcon("HiOutlineCode");

  const { t } = useTranslation();

  const handleClick = () => dispatch({ type: "@top-bar/open-go-to-line" });

  return (
    <div className="status-bar">
      <div className="status-bar-side-container">
        {current.tab && (
          <div className="status-bar-item" onClick={handleClick}>
            <Code />
            <div className="flex space-x-2">
              {current.tab.caretPositions.map((position, index) => {
                const direction = position.direction === "ltr" ? "end" : "start";

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
        )}
      </div>

      <Notifications />
    </div>
  );
};
