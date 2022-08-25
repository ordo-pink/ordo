import React from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@core/state/store";
import { useIcon } from "@core/hooks/use-icon";

export const Activities: React.FC = () => {
  const dispatch = useAppDispatch();

  const CogIcon = useIcon("HiOutlineCog");
  const OpenFolderIcon = useIcon("HiOutlineFolderOpen");

  const { t } = useTranslation();

  const handleOpenFolderClick = () => {
    dispatch({ type: "@app/select-project" });
    dispatch({ type: "@side-bar/show" });
    dispatch({ type: "@activity-bar/open-editor" });
  };

  const handleSettingsClick = () => dispatch({ type: "@activity-bar/open-settings" });

  return (
    <div>
      <h2 className="welcome-page_actions-heading">{t("welcome-page.quick-actions")}</h2>
      <button className="welcome-page_action" onClick={handleOpenFolderClick}>
        <OpenFolderIcon />
        <span>{t("app.commands.open-folder")}</span>
      </button>
      <button className="welcome-page_action" onClick={handleSettingsClick}>
        <CogIcon />
        <span>{t("activity-bar.commands.open-settings")}</span>
      </button>
    </div>
  );
};
