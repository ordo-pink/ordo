import { useState, useEffect } from "react"

type Props = {
  name: string
  currentActivityName: string
}

/**
 * Extracted class attribute value compilation for the ActivityBarItem.
 */
export const useActivityBarItemClass = ({ name, currentActivityName }: Props) => {
  const [isCurrentActivity, setIsCurrentActivity] = useState(false)

  useEffect(() => {
    setIsCurrentActivity(name === currentActivityName)

    return () => {
      setIsCurrentActivity(false)
    }
  }, [name, currentActivityName])

  return `text-xl hover:text-pink-600 transition-colors duration-300 ${
    isCurrentActivity && "text-pink-700"
  } activity-bar-icon`
}
