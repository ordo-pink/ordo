import React from "react";
import { Either } from "or-else";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@core/state/store";
import { RecentProject } from "@modules/welcome-page/components/recent-project";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/functions";

export const RecentProjects: React.FC = () => {
  const recentProjects = useAppSelector((state) => state.app.internalSettings.window?.recentProjects);

  const { t } = useTranslation();

  return Either.fromNullable(recentProjects)
    .chain((projects) => fromBoolean(projects.length > 0))
    .fold(NoOp, () => (
      <div>
        <h2 className="welcome-page_actions-heading">{t("welcome-page.recent-projects")}</h2>
        {recentProjects.map((path) => (
          <RecentProject key={path} path={path} />
        ))}
      </div>
    ));
};
