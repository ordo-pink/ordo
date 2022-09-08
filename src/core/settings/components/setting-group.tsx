import React from "react";
import { useTranslation } from "react-i18next";

import Setting from "@core/settings/components/setting";

type Props = {
  categoryName: string;
  category: any;
};

/**
 * A fieldset of settings that belong to the same category.
 */
const SettingGroup = ({ categoryName, category }: Props) => {
  const { t } = useTranslation();

  const headingTranslationKey = `${category.description}.heading`;
  const subheadingTranslationKey = `${category.description}.subheading`;

  return (
    <fieldset className="settings_group">
      <div className="settings_group_title-section">
        <h2 className="settings_group_title-section_heading">{t(headingTranslationKey)}</h2>
        <h3 className="settings_group_title-section_subheading">{t(subheadingTranslationKey)}</h3>
      </div>

      {Object.keys(category.properties).map((propertyKey) => (
        <Setting
          key={`${categoryName}-${propertyKey}`}
          propertyKey={propertyKey}
          property={category.properties[propertyKey]}
          schemaKey={categoryName}
        />
      ))}
    </fieldset>
  );
};

export default SettingGroup;
