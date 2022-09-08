import { OrdoEventHandler } from "@core/types";

export const handleSelect: OrdoEventHandler<"@activity-bar/select"> = ({ draft, payload, transmission }) => {
  const activitiesWithSideBar = ["Editor"];
  const sideBarEvent = activitiesWithSideBar.includes(payload) ? "@side-bar/show" : "@side-bar/hide";

  transmission.emit(sideBarEvent, null);

  draft.activityBar.current = payload;
};
