import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEventHandler } from "@core/types";
import { OrdoEvents } from "@init/types";
import { TopBarEvents } from "@modules/top-bar/types";
import { FoldVoid, fromBoolean } from "@utils/either";

/**
 * Triggers focusing the TopBar.
 */
const handleFocus: OrdoEventHandler<"@top-bar/focus"> = ({ draft }) => {
  draft.topBar.focused = true;
};

/**
 * Triggers unfocusing the TopBar.
 */
const handleUnfocus: OrdoEventHandler<"@top-bar/unfocus"> = ({ draft }) => {
  draft.topBar.value = "";
  draft.topBar.focused = false;
};

/**
 * Toggles the TopBar focus. It internally calls `@top-bar/focus` or `@top-bar/unfocus`
 * depending on the current state.
 */
const handleToggleFocus: OrdoEventHandler<"@top-bar/toggle-focus"> = ({ transmission }) =>
  fromBoolean(transmission.select((state) => state.topBar.focused))
    .bimap(
      () => transmission.emit("@top-bar/focus", null),
      () => transmission.emit("@top-bar/unfocus", null),
    )
    .fold(...FoldVoid);

/**
 * Sets the value of the TopBar input to the state.
 */
const handleSetValue: OrdoEventHandler<"@top-bar/set-value"> = ({ draft, payload }) => {
  draft.topBar.value = payload;
};

/**
 * Triggers opening the command palette.
 */
const handleOpenCommandPalette: OrdoEventHandler<"@top-bar/open-command-palette"> = ({ draft }) => {
  draft.topBar.focused = true;
  draft.topBar.value = ">";
};

/**
 * Triggers opening search in the file.
 */
const handleOpenSearchInFile: OrdoEventHandler<"@top-bar/open-search-in-file"> = ({ draft }) => {
  draft.topBar.focused = true;
  draft.topBar.value = "";
};

/**
 * Triggers opening the "Go to Line" mode.
 */
const handleOpenGoToLine: OrdoEventHandler<"@top-bar/open-go-to-line"> = ({ draft }) => {
  draft.topBar.focused = true;
  draft.topBar.value = ":";
};

/**
 * Triggers opening the "Go to File" mode.
 */
const handleOpenGoToFile: OrdoEventHandler<"@top-bar/open-go-to-file"> = ({ draft }) => {
  draft.topBar.focused = true;
  draft.topBar.value = "@";
};

/**
 * Triggers the provided Ordo Command.
 */
const handleRunCommand: OrdoEventHandler<"@top-bar/run-command"> = ({ transmission, payload }) => {
  transmission.emit(payload as keyof OrdoEvents, null);
};

export default registerEvents<TopBarEvents>({
  "@top-bar/focus": handleFocus,
  "@top-bar/unfocus": handleUnfocus,
  "@top-bar/toggle-focus": handleToggleFocus,
  "@top-bar/set-value": handleSetValue,
  "@top-bar/open-command-palette": handleOpenCommandPalette,
  "@top-bar/open-search-in-file": handleOpenSearchInFile,
  "@top-bar/open-go-to-line": handleOpenGoToLine,
  "@top-bar/open-go-to-file": handleOpenGoToFile,
  "@top-bar/run-command": handleRunCommand,
});
