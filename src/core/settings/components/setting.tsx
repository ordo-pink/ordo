import React from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@core/state/store";
import { useSettingInput } from "@core/settings/hooks/use-setting-input";

type Props = {
  propertyKey: string;
  property: any;
  schemaKey: string;
};

/**
 * A configurable application option.
 */
const Setting = ({ propertyKey, property, schemaKey }: Props) => {
  const { t } = useTranslation();

  const settings = useAppSelector((state) => state.app.userSettings) as any;

  const titleTranslationKey = `${property.description}.title`;
  const descriptionTranslationKey = `${property.description}.description`;

  const InputComponent = useSettingInput(property);

  return (
    <div className="settings_item">
      {propertyKey !== "exclude" && propertyKey !== "associations" && (
        <label className="settings_item_label">
          <div>
            <h4>{t(titleTranslationKey)}</h4>
            <h5 className="settings_item_description">{t(descriptionTranslationKey)}</h5>
          </div>

          <InputComponent
            value={settings[schemaKey][propertyKey]}
            schemaKey={`${schemaKey}.${propertyKey}`}
            options={property.enum}
            propertyDescription={property.description}
          />
        </label>
      )}
    </div>
  );
};

export default Setting;
