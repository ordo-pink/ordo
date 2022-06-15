import { Link } from "gatsby"
import React from "react"
import { FaTwitter } from "react-icons/fa"

export const Header: React.FC = () => (
  <div className="flex justify-between items-center p-4">
    <div>
      <Link
        className="text-2xl text-neutral-500 hover:text-rose-500 transition-colors duration-300"
        to="/"
      >
        ||l
      </Link>
    </div>
    <div>
      <a href="https://twitter.com/ordo_pink">
        <FaTwitter className="text-2xl text-neutral-500 hover:text-rose-500 transition-colors duration-300" />
      </a>
    </div>
  </div>
)
