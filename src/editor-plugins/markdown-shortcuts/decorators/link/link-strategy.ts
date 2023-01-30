import { ContentBlock, ContentState } from "draft-js"

import { UnaryFn } from "$core/types"

const createLinkStrategy = () => {
  const findLinkEntities = (
    contentBlock: ContentBlock,
    callback: UnaryFn<unknown, unknown>,
    contentState: ContentState,
  ) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity()
      return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK"
    }, callback)
  }
  return findLinkEntities
}

export default createLinkStrategy
