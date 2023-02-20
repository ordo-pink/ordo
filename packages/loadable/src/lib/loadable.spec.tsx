import { render, act } from "@testing-library/react"
import { loadable } from "./loadable"

describe("Loadable", () => {
  it("should render successfully", () => {
    act(() => {
      const Loadable = loadable({
        loader: () => Promise.resolve(() => <div>Hello</div>),
        loading: () => <div>Loading...</div>,
      })

      const { baseElement } = render(<Loadable />)

      expect(baseElement).toBeTruthy()
    })
  })
})
