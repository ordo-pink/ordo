import React from "react";
import { useTranslation } from "react-i18next";

import { userSettingsSchema } from "@core/settings/user-settings-schema";
import { useAppDispatch, useAppSelector } from "@core/state/store";

export const Settings: React.FC = () => {
  const schema: any = userSettingsSchema;
  const settings: any = useAppSelector((state) => state.app.userSettings);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div className="h-[calc(100vh-3.75rem)] overflow-y-auto">
      <form className="m-[10%]">
        {Object.keys(schema).map((key) => (
          <fieldset key={key} className="my-5 p-5 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-lg">
            <div className="text-center">
              {schema[key].description &&
                t(schema[key].description)
                  .split("::")
                  .map((line: string, index: number) => (
                    <div
                      key={line}
                      className={index === 0 ? "font-bold uppercase" : "text-sm text-neutral-600 dark:text-neutral-400"}
                    >
                      {line}
                    </div>
                  ))}
            </div>
            {Object.keys(schema[key].properties).map((property) => (
              <div key={`${key}-${property}`} className="">
                {property !== "exclude" && property !== "associations" && (
                  <label className="flex justify-between items-center w-full py-3">
                    <div>
                      {schema[key].properties[property].description &&
                        t(schema[key].properties[property].description)
                          .split("::")
                          .map((line: string, index: number) => (
                            <p
                              key={line}
                              className={index === 0 ? "" : "text-sm text-neutral-600 dark:text-neutral-400"}
                            >
                              {line}
                            </p>
                          ))}
                    </div>
                    {schema[key].properties[property].enum ? (
                      <select
                        className="dark:bg-neutral-800"
                        value={settings[key][property]}
                        onChange={(e) =>
                          dispatch({ type: "@app/set-user-setting", payload: [`${key}.${property}`, e.target.value] })
                        }
                      >
                        {schema[key].properties[property].enum.map((value: string) => (
                          <option key={`${key}-${value}`} value={value}>
                            {t(`${schema[key].properties[property].description}.${value}`)}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    {schema[key].properties[property].type === "boolean" ? (
                      <input
                        type="checkbox"
                        checked={settings[key][property]}
                        onChange={(e) =>
                          dispatch({
                            type: "@app/set-user-setting",
                            payload: [`${key}.${property}`, !settings[key][property]],
                          })
                        }
                      />
                    ) : null}
                  </label>
                )}
              </div>
            ))}
          </fieldset>
        ))}
      </form>
    </div>
  );
};
