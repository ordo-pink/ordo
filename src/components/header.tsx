import { Link } from "gatsby"
import React from "react"
import { FaTwitter, FaTelegram } from "react-icons/fa"

export const Header: React.FC = () => (
  <div className="flex justify-between items-center p-4">
    <Link
      className="text-2xl text-neutral-500 hover:text-rose-500 transition-colors duration-300 font-black"
      to="/"
    >
      ORDO.PINK
    </Link>
    <div className="flex items-center space-x-4">
      <a href="https://twitter.com/ordo_pink" target="_blank" rel="nofollow">
        <FaTwitter className="text-2xl text-neutral-500 hover:text-rose-500 transition-colors duration-300" />
      </a>
      <a href="https://t.me/ordo_pink_ru" target="_blank" rel="nofollow">
        <FaTelegram className="text-2xl text-neutral-500 hover:text-rose-500 transition-colors duration-300" />
      </a>
    </div>
  </div>
)
