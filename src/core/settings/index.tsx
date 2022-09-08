import React from "react";

import { userSettingsSchema } from "@core/settings/user-settings-schema";

import SettingGroup from "@core/settings/components/setting-group";

import "@core/settings/index.css";

const Settings = () => {
  const schema: any = userSettingsSchema;
  const schemaKeys = Object.keys(schema);

  return (
    <div className="settings">
      <form className="settings_form">
        {schemaKeys.map((key) => (
          <SettingGroup key={key} categoryName={key} category={schema[key]} />
        ))}
      </form>
    </div>
  );
};

export default Settings;
