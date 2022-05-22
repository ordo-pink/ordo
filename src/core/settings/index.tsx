import React from "react";

import { userSettingsSchema } from "@core/settings/user-settings-schema";
import Scrollbars from "react-custom-scrollbars-2";
import { useAppDispatch, useAppSelector } from "@core/state/store";

export const Settings: React.FC = () => {
	const schema: any = userSettingsSchema;
	const settings: any = useAppSelector((state) => state.app.userSettings);
	const dispatch = useAppDispatch();

	return (
		<Scrollbars autoHide>
			<div className="mx-[10%] mt-12 flex items-center justify-center">
				<span className="px-4 py-2 bg-pink-200 text-pink-700 dark:bg-pink-800 dark:text-pink-200 rounded-lg shadow-lg text-sm text-center">
					Updates are saved automatically 👍
				</span>
			</div>

			<form className="m-[10%]">
				{Object.keys(schema).map((key) => (
					<fieldset key={key} className="my-5 p-5 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-lg">
						<div className="text-center">
							{schema[key].description &&
								schema[key].description.split("::").map((line: string, index: number) => (
									<div
										key={line}
										className={index === 0 ? "font-bold uppercase" : "text-sm text-neutral-600 dark:text-neutral-400"}
									>
										{line}
									</div>
								))}
						</div>
						{Object.keys(schema[key].properties).map((property) => (
							<p key={`${key}-${property}`} className="">
								{property !== "exclude" && property !== "associations" && (
									<label className="flex justify-between items-center w-full py-3">
										<div>
											{schema[key].properties[property].description &&
												schema[key].properties[property].description.split("::").map((line: string, index: number) => (
													<p key={line} className={index === 0 ? "" : "text-sm text-neutral-600 dark:text-neutral-400"}>
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
													<option value={value}>{value}</option>
												))}
											</select>
										) : null}
										{schema[key].properties[property].type === "boolean" ? (
											<input
												type="checkbox"
												checked={settings[key][property]}
												onChange={(e) =>
													dispatch({ type: "@app/set-user-setting", payload: [`${key}.${property}`, !settings[key][property]] })
												}
											/>
										) : null}
									</label>
								)}
							</p>
						))}
					</fieldset>
				))}
			</form>
		</Scrollbars>
	);
};
