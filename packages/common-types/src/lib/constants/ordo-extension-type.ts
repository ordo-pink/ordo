/**
 * There are four supported types of Ordo extensions.
 */
export enum OrdoExtensionType {
  /**
   * ACTIVITY extensions take the whole Workspace of th Ordo application and
   * allow to provide exclusive user experience outside the editor window. Every
   * ACTIVITY MUST export a component to be loaded when the user enters the
   * activity.
   */
  ACTIVITY = "activity",

  /**
   * COMMAND extensions provide user actions. These actions can be accessed via
   * the CommandPalette, via ContextMenu (right click with a mouse), and/or via
   * keyboard shortcuts.
   */
  COMMAND = "command",

  /**
   * EDITOR_PLUGIN extensions add new features to the Ordo Markdown editor. You
   * can refer to Lexical Editor docs.
   *
   * @see https://lexical.dev/docs/intro
   */
  EDITOR_PLUGIN = "editor-plugin",

  /**
   * FILE_ASSOCIATION extensions are meant to be used for teaching Ordo to open
   * new file types.
   */
  FILE_ASSOCIATION = "file-association",
}
