import { ContentState } from "draft-js"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  contentState: ContentState
  entityKey: string
}>

export default function Image({ entityKey, children, contentState }: Props) {
  const { src, alt, title } = contentState.getEntity(entityKey).getData()

  return (
    <span>
      {children}
      <img
        src={src}
        alt={alt}
        title={title}
      />
    </span>
  )
}
