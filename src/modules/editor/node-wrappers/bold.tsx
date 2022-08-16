import React from "react";

export const BoldWrapper =
  (): React.FC =>
  ({ children }) =>
    <strong className="font-bold">{children}</strong>;
