import React from "react"
import { Link } from "gatsby"

export const Footer: React.FC = () => (
  <footer className="py-10 self-center">
    © {new Date().getFullYear()}{" "}
    <Link className="underline" to="/">
      Ordo ||l
    </Link>
  </footer>
)
