import { showCommandPalette, slice } from "$commands/command-palette/store"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("command-palette", {
  commands: [
    {
      Icon: () => import("$commands/command-palette/components/show-command-palette-icon"),
      title: "@ordo-command-command-palette/show-command-palette",
      accelerator: "ctrl+shift+p",
      showInCommandPalette: false,
      showInContextMenu: true,
      action: ({ dispatch }) => void dispatch(showCommandPalette()),
    },
  ],
  overlayComponents: [() => import("$commands/command-palette/components/modal")],
  translations: {
    ru: {
      "@ordo-command-command-palette/readable-name": "Панель команд",
      "@ordo-command-command-palette/show-command-palette": "Показать панель команд",
      "@ordo-command-command-palette/placeholder": "Быстрый поиск",
      "@ordo-command-command-palette/description": "TODO",
    },
    en: {
      "@ordo-command-command-palette/readable-name": "Command Palette",
      "@ordo-command-command-palette/show-command-palette": "Show command palette",
      "@ordo-command-command-palette/placeholder": "Quick search",
      "@ordo-command-command-palette/description": "TODO",
    },
  },
  readableName: "@ordo-command-command-palette/readable-name",
  storeSlice: slice,
  description: "@ordo-command-command-palette/description",
})
