import React, { useEffect, useState } from "react";

import { useAppSelector } from "@core/state/store";
import { ActivityBarIcon } from "@modules/activity-bar/components/activity-bar-icon";
import { ActivityBarItem } from "@modules/activity-bar/types";

import "@modules/activity-bar/index.css";

const defaultActivities: ActivityBarItem[] = [
  {
    name: "WelcomePage",
    icon: "HiOutlineInbox",
    isShown: true,
  },
];

const ActivityBar = () => {
  const activityBarItems = useAppSelector((state) => state.activityBar.items);
  const currentActivity = useAppSelector((state) => state.activityBar.current);
  const currentProjectPath = useAppSelector((state) => state.fileExplorer.tree?.path);

  const [availableActivities, setAvailableActivities] = useState<ActivityBarItem[]>(defaultActivities);

  useEffect(() => {
    const activities = currentProjectPath ? activityBarItems : defaultActivities;
    setAvailableActivities(activities);
  }, [currentProjectPath]);

  return (
    <div className="activity-bar">
      <div className="activity-bar_section">
        {availableActivities.map((item) => (
          <ActivityBarIcon
            key={item.name}
            currentActivity={currentActivity}
            name={item.name}
            icon={item.icon}
            isShown={item.isShown}
          />
        ))}
      </div>
      <ActivityBarIcon currentActivity={currentActivity} name="Settings" icon="HiOutlineCog" isShown={true} />
    </div>
  );
};

export default ActivityBar;
