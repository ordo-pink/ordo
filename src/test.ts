import { lazySwitch, Switch } from "--index"

describe("Switch", () => {
  it("should apply fall into case if the value matches", () => {
    expect(
      Switch.of(1)
        .case(1, () => true)
        .default(() => false),
    ).toEqual(true)
  })

  it("should apply fall into case if the validation succeeded", () => {
    expect(
      Switch.of(1)
        .case(
          (x) => x === 1,
          () => true,
        )
        .default(() => false),
    ).toEqual(true)
  })

  it("should apply fall into default none of the cases succeeded", () => {
    expect(
      Switch.of(2)
        .case(1, () => false)
        .case(3, () => false)
        .default(() => true),
    ).toEqual(true)
  })

  it("should apply the first case where the value matched", () => {
    expect(
      Switch.of(1)
        .case(1, () => true)
        .case(1, () => false)
        .default(() => false),
    ).toEqual(true)
  })
})

describe("lazySwitch", () => {
  it("should allow assigning switch behaviour before the context argument is provided", () => {
    const run = lazySwitch<number>((s) =>
      s
        .case(
          (n) => n > 1,
          () => true,
        )
        .case(
          (n) => n < 2,
          () => false,
        )
        .default(() => null),
    )

    expect(run(1.5)).toEqual(true)
  })
})
