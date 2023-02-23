import React from "react"

type Props = {
  text: string
}

export const GradientTitle: React.FC<Props> = ({ text }) => (
  <h1 className="text-8xl font-black uppercase bg-gradient-to-bl from-orange-600 to-pink-700 text-transparent bg-clip-text drop-shadow-lg">
    {text}
  </h1>
)
