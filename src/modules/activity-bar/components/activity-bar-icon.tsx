import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@core/state/store";
import { ActivityBarItem } from "@modules/activity-bar/types";
import { useIcon } from "@core/hooks/use-icon";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/functions";

type Props = ActivityBarItem & { currentActivity: string };

export const ActivityBarIcon = ({ icon, isShown, name, currentActivity }: Props) => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const Icon = useIcon(icon as any);

  const isCurrentActivity = currentActivity === name;
  const className = isCurrentActivity ? "activity_current" : "";

  const activityTranslationKey = `activities.activity.${name}.name`.toLowerCase();

  const handleClick = () => dispatch({ type: "@activity-bar/select", payload: name });

  return fromBoolean(isShown).fold(NoOp, () => (
    <button tabIndex={2} className={`activity ${className}`} onClick={handleClick} title={t(activityTranslationKey)}>
      <Icon />
    </button>
  ));
};
