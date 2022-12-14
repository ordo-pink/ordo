import { Link, useParams } from "react-router-dom"

import EmptyEditor from "$activities/editor/components/empty-editor"
import { useFileAssociation } from "$activities/editor/hooks/use-file-association.hook"

import "$activities/editor/index.css"

export default function Editor() {
  const { path } = useParams()
  const association = useFileAssociation()

  const Component = association ? association.Component : EmptyEditor

  // TODO: Extract Sidebar, make adding WorkspaceWithSidebar more convenient (Maybe extract Sidebar on extension registration level)
  return (
    <div className="editor">
      <div className="bg-neutral-200 dark:bg-neutral-800 p-2 my-[-0.5rem] ml-[-0.5rem] flex flex-col">
        {/* TODO: Remove dummy link */}
        <Link to="/editor/ism/123.ism">123.ism</Link>
        <Link to="/editor/md/123.md">123.md</Link>
      </div>

      <div className="pl-2 w-full">{path ? <Component /> : <EmptyEditor />}</div>
    </div>
  )
}
