import { OrdoEventHandler } from "@core/types";
import { OrdoEvents } from "@init/types";

export const handleOpen =
  <T extends keyof OrdoEvents>(activity: string): OrdoEventHandler<T> =>
  ({ transmission }) => {
    transmission.emit("@activity-bar/select", activity);
  };
