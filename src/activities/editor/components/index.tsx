import { useParams } from "react-router-dom"

import EmptyEditor from "$activities/editor/components/empty-editor"
import { useFileAssociation } from "$activities/editor/hooks/use-file-association.hook"

import "$activities/editor/index.css"

export default function Editor() {
  const { path } = useParams()
  const association = useFileAssociation()

  const Component = association ? association.Component : () => null

  return <div className="editor">{path ? <Component /> : <EmptyEditor />}</div>
}
