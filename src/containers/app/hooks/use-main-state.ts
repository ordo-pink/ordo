import React from "react";

import { useInternalDispatch, useAppDispatch, applyStatePatches, setState } from "@core/state/store";

export const useMainState = () => {
  const internalDispatch = useInternalDispatch();
  const dispatch = useAppDispatch();

  const handleApplyPatches = ({ detail }: any) => internalDispatch(applyStatePatches(detail));
  const handleSetState = ({ detail }: any) => internalDispatch(setState(detail));

  React.useEffect(() => {
    dispatch({ type: "@app/get-state" });
    dispatch({ type: "@app/get-internal-settings" });
    dispatch({ type: "@app/get-user-settings" });

    window.addEventListener("@app/set-state", handleSetState);
    window.addEventListener("@app/apply-patches", handleApplyPatches);

    return () => {
      window.removeEventListener("@app/set-state", handleApplyPatches);
      window.removeEventListener("@app/apply-patches", handleApplyPatches);
    };
  }, []);
};
