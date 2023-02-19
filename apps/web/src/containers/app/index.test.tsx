import { render, screen } from "@testing-library/react"
import OrdoButton from "../../core/components/buttons"
import "@testing-library/jest-dom"

test("it should render button", () => {
  render(
    <OrdoButton
      onClick={() => {
        throw new Error("Function not implemented.")
      }}
    >
      {/* eslint-disable-next-line i18next/no-literal-string */}
      {/* eslint-disable-next-line i18next/no-literal-string */}
      Test Button
    </OrdoButton>,
  )
  const linkElement = screen.getByText(/Test Button/i)
  expect(linkElement).toBeInTheDocument()
})
