import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@core/state/store";

type Props = {
  schemaKey: string;
  value: any;
  options: string[];
  propertyDescription: any;
};

/**
 * Input for enum settings.
 */
const SelectSetting = ({ schemaKey, value: initialValue, options, propertyDescription }: Props) => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const getOptionTranslationKey = (value: string) => `${propertyDescription}.${value}`;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    dispatch({ type: "@app/set-user-setting", payload: [schemaKey, value] });
  };

  return (
    <select className="settings_item_select" value={initialValue} onChange={handleChange}>
      {options.map((value) => (
        <option key={`${schemaKey}-${value}`} value={value}>
          {t(getOptionTranslationKey(value))}
        </option>
      ))}
    </select>
  );
};

export default SelectSetting;
