import React from "react";

export const useTreeNesting = (depth: number) => {
  const nesting = React.useMemo(() => (depth ? depth * 12 + "px" : "0px"), [depth]);

  return nesting;
};
