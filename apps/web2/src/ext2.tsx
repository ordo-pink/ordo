import { createRoot } from "react-dom/client"
import { createExtension } from "./create-extension"
import { ExtensionCreatorContext, RenderActivityContext } from "./types"

type Props = Pick<ExtensionCreatorContext, "executeCommand">

const App = ({ executeCommand }: Props) => {
  return (
    <div>
      <button onClick={() => executeCommand("router.navigate", "/")}>Navigate to /</button>
      <button onClick={() => executeCommand("ext2.bark")}>Log Woof</button>
    </div>
  )
}

export default createExtension("ext2", ({ executeCommand, registerCommand }) => {
  return {
    init: () => {
      setTimeout(() => registerCommand("ext2.bark", () => console.log("woof")), 5000)

      // TODO: Refactor activities to the same pattern as commands
      executeCommand("ext2.bark")

      return {
        routes: ["/123"],
      }
    },
    renderActivity: ({ container }: RenderActivityContext) => {
      const root = createRoot(container)

      root.render(<App executeCommand={executeCommand} />)
    },
  }
})
