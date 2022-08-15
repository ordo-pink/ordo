import React from "react";

export const ItalicWrapper =
  (): React.FC =>
  ({ children }) =>
    <em className="italic">{children}</em>;
