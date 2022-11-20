import "$containers/workspace/index.css"

type Props = {
  element: JSX.Element
}

export default function Workspace({ element }: Props) {
  return <div className="workspace">{element}</div>
}
