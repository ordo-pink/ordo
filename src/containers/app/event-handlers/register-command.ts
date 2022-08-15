import { OrdoEventHandler } from "@core/types";

/**
 * Registers a provided command in the TopBar command palette.w
 */
export const handleRegisterCommand: OrdoEventHandler<"@app/register-command"> = ({ draft, payload }) => {
  draft.app.commands.push(payload);
};
