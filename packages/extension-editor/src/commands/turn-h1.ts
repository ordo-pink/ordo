// const TURN_TO_HEADING_2 = commands.on(
//   "turn-to-heading-2",
//   ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
//     payload.editor.update(() => {
//       const selection = $getSelection()
//       if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
//         $setBlocksType_experimental(selection, () => $createHeadingNode("h2"))
//       }
//     })
//   },
// )

// registerContextMenuItem(TURN_TO_HEADING_2, {
//   payloadCreator: (payload) => payload,
//   type: "update",
//   Icon: BsTypeH2,
//   shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
// })

// const TURN_TO_HEADING_3 = commands.on(
//   "turn-to-heading-3",
//   ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
//     payload.editor.update(() => {
//       const selection = $getSelection()
//       if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
//         $setBlocksType_experimental(selection, () => $createHeadingNode("h3"))
//       }
//     })
//   },
// )

// registerContextMenuItem(TURN_TO_HEADING_3, {
//   payloadCreator: (payload) => payload,
//   type: "update",
//   Icon: BsTypeH3,
//   shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
// })

// const TURN_TO_PARAGRAPH = commands.on(
//   "turn-to-paragraph",
//   ({ payload }: CommandContext<{ element: HTMLElement; editor: LexicalEditor }>) => {
//     payload.editor.update(() => {
//       const selection = $getSelection()
//       if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
//         $setBlocksType_experimental(selection, () => $createParagraphNode())
//       }
//     })
//   },
// )

// registerContextMenuItem(TURN_TO_PARAGRAPH, {
//   payloadCreator: (payload) => payload,
//   type: "update",
//   Icon: BsTextParagraph,
//   shouldShow: (target) => Boolean(target.element) && Boolean(target.editor),
// })
