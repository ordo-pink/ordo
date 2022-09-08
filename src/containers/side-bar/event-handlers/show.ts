import { OrdoEventHandler } from "@core/types";

/**
 * Triggers showing the SideBar. If SideBar width is set to be less than 1% of the screen width,
 * the width will be updated to take 20% of the screen size.
 */
export const handleShow: OrdoEventHandler<"@side-bar/show"> = ({ draft, transmission }) => {
  const width = transmission.select((state) => state.sideBar.width);

  if (width <= 1) {
    draft.sideBar.width = 20;
  }

  draft.sideBar.isShown = true;
};
