import { ThunkFn } from "@ordo-pink/core"
import { DraftDecorator } from "draft-js"

import Image from "$editor-plugins/markdown-shortcuts/components/image"

export const createImageDecorator: ThunkFn<DraftDecorator> = () => ({
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && contentState.getEntity(entityKey).getType() === "IMG"
    }, callback)
  },
  component: Image,
})
