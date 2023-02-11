import { ThunkFn } from "@ordo-pink/core"
import { DraftDecorator } from "draft-js"

import Link from "$editor-plugins/markdown-shortcuts/components/link"

export const createLinkDecorator: ThunkFn<DraftDecorator> = () => ({
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK"
    }, callback)
  },
  component: Link,
})
