import React from "react";

import { useAppDispatch } from "@core/state/store";

type Props = {
  schemaKey: string;
  value: boolean;
};

/**
 * Input for settings with boolean values.
 */
const CheckboxSetting = ({ schemaKey, value }: Props) => {
  const dispatch = useAppDispatch();

  const handleChange = () => {
    const newValue = !value;

    dispatch({ type: "@app/set-user-setting", payload: [schemaKey, newValue] });
  };

  return <input type="checkbox" checked={value} onChange={handleChange} />;
};

export default CheckboxSetting;
