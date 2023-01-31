import { ContentState } from "draft-js"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  contentState: ContentState
  entityKey: string
}>

export default function Link({ contentState, children, entityKey }: Props) {
  const { href, title } = contentState.getEntity(entityKey).getData()

  return (
    <a
      href={href}
      title={title}
    >
      {children}
    </a>
  )
}
