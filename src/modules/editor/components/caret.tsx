import React from "react";

import { useAppSelector } from "@core/state/store";

type CaretProps = {
  visible?: boolean;
  children?: any;
};

export const Caret = React.memo(
  ({ visible = false, children }: CaretProps) => {
    const focused = useAppSelector((state) => state.editor.focused);

    return (
      <span
        className={`editor_caret ${focused ? "" : "editor_caret_unfocused"} relative ${visible ? "inline" : "hidden"}`}
      >
        {children}
      </span>
    );
  },
  (prev, next) => prev.visible === next.visible,
);
