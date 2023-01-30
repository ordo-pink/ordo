import { ContentBlock, ContentState } from "draft-js"

import { UnaryFn } from "$core/types"

const createImageStrategy = () => {
  const findImageEntities = (
    contentBlock: ContentBlock,
    callback: UnaryFn<unknown, unknown>,
    contentState: ContentState,
  ) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && contentState.getEntity(entityKey).getType() === "IMG"
    }, callback)
  }
  return findImageEntities
}

export default createImageStrategy
