import React from "react";
import { Either } from "or-else";

import { useAppSelector } from "@core/state/store";
import { ActivityBarIcon } from "@modules/activity-bar/components/activity-bar-icon";

import "@modules/activity-bar/index.css";

export const ActivityBar: React.FC = () => {
  const items = useAppSelector((state) => state.activityBar.items);
  const current = useAppSelector((state) => state.activityBar.current);
  const tree = useAppSelector((state) => state.fileExplorer.tree);

  return Either.fromNullable(tree)
    .chain((t) => Either.fromNullable(t.path))
    .fold(
      () => (
        <div className="activity-bar">
          <ActivityBarIcon current={current} name="WelcomePage" icon="HiOutlineInbox" show={true} />
          <ActivityBarIcon current={current} name="Settings" icon="HiOutlineCog" show={true} />
        </div>
      ),
      () => (
        <div className="activity-bar">
          <div className="flex flex-col space-y-2">
            {items.map((item) => (
              <ActivityBarIcon key={item.name} current={current} name={item.name} icon={item.icon} show={item.show} />
            ))}
          </div>
          <ActivityBarIcon current={current} name="Settings" icon="HiOutlineCog" show={true} />
        </div>
      ),
    );
};
