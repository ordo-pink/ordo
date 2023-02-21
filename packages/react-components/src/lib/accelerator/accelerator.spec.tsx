import { render } from "@testing-library/react"

import { Accelerator } from "./accelerator"

describe("Accelerator", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Accelerator accelerator="ctrl+shift+k" />)
    expect(baseElement).toBeTruthy()
  })
})
