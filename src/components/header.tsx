import { Link } from "gatsby"
import React from "react"
import { FaTwitter, FaTelegram } from "react-icons/fa"

export const Header: React.FC = () => (
  <div className="header">
    <Link to="/" className="header__logo logo">
      <picture>
        <source srcSet="/img/logo.webp" type="image/webp" />
        <img
          className="image"
          src="/img/logo.png"
          width="116"
          height="116"
          alt="Логотип ORDO"
          decoding="async"
        />
      </picture>
    </Link>

    <h1 className="invisible">
      ORDO заметки для быстрой, объёмной, удобной работы
    </h1>
  </div>
)
