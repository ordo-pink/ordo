export const preventDefault = <
  T extends {
    stopPropagation: Event["stopPropagation"]
    preventDefault: Event["preventDefault"]
  },
>(
  e: T,
) => e.preventDefault()

export const stopPropagation = <
  T extends {
    stopPropagation: Event["stopPropagation"]
    preventDefault: Event["preventDefault"]
  },
>(
  e: T,
) => e.stopPropagation()
