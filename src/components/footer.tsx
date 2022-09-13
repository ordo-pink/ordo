import React from "react"
import { Link } from "gatsby"

export const Footer: React.FC = () => (
  <footer className="footer">
    <nav className="footer__nav">
      <ul className="footer__menu">
        <li className="footer__menu-item">
          <Link to="/" className="footer__menu-link">
            Главная
          </Link>
        </li>
        <li className="footer__menu-item">
          <Link to="/blog" className="footer__menu-link">
            Блог
          </Link>
        </li>
        <li className="footer__menu-item">
          <Link to="/download" className="footer__menu-link">
            Скачать
          </Link>
        </li>
      </ul>
    </nav>

    <ul className="footer__social">
      <li className="footer__social-item">
        <a
          href="https://twitter.com/ordo_pink"
          target="_blank"
          className="footer__social-link social-link"
        >
          Twitter
        </a>
      </li>
      <li className="footer__social-item">
        <a
          href="https://t.me/ordo_pink_ru"
          target="_blank"
          className="footer__social-link social-link"
        >
          Telegram
        </a>
      </li>
      <li className="footer__social-item">
        <a
          href="https://github.com/ordo-pink"
          target="_blank"
          className="footer__social-link social-link"
        >
          GitHub
        </a>
      </li>
    </ul>

    <Link to="/cookie-policy" className="footer__link">
      Использование cookie (English)
    </Link>
    <Link to="/privacy-policy" className="footer__link">
      Политика конфиденциальности (English)
    </Link>

    <p className="footer__copyright">© {new Date().getFullYear()} ordo.pink</p>
  </footer>
)
