import React from "react"
import { Link } from "gatsby"

type TFooterSectionProps = {
  title: string
  items: {
    text: string
    href: string
    newTab?: boolean
    nofollow?: boolean
  }[]
}

const socialMediaLinks: TFooterSectionProps = {
  title: "Социальные сети",
  items: [
    {
      text: "Telegram",
      href: "https://t.me/ordo_pink_ru",
      newTab: true,
      nofollow: true,
    },
    {
      text: "Twitter",
      href: "https://twitter.com/ordo_pink",
      newTab: true,
      nofollow: true,
    },
    {
      text: "GitHub",
      href: "https://github.com/ordo-pink",
      newTab: true,
      nofollow: true,
    },
  ],
}

const siteMapLinks: TFooterSectionProps = {
  title: "Карта сайта",
  items: [
    {
      text: "Главная",
      href: "/",
    },
    {
      text: "Скачать",
      href: "/download",
    },
    // {
    //   text: "Блог",
    //   href: "/blog",
    //   nofollow: true,
    // },
    // {
    //   text: "Цены",
    //   href: "/pricing",
    //   nofollow: true,
    // },
  ],
}

export const Footer: React.FC = () => (
  <footer className="p-8 bg-gradient-to-b from-neutral-800 to-neutral-900">
    <div className="flex flex-wrap flex-col md:justify-center md:flex-row space-y-4 md:space-y-0 md:space-x-16">
      <FooterSection {...siteMapLinks} />
      <FooterSection {...socialMediaLinks} />
    </div>

    <div className="mt-4 flex flex-col items-center text-sm text-neutral-500">
      <Link to="/cookie-policy">Использование cookie (English)</Link>
      <Link to="/privacy-policy">Политика конфиденциальности (English)</Link>
    </div>

    <div className="text-center mt-8">
      <span>© {new Date().getFullYear()} </span>
      <Link className="underline" to="/">
        ordo.pink
      </Link>
    </div>
  </footer>
)

const FooterSection: React.FC<TFooterSectionProps> = ({ title, items }) => (
  <div>
    <h3 className="uppercase font-bold mb-2">{title}</h3>
    <div>
      {items &&
        items.map(item => (
          <p key={item.text + item.href}>
            {item.href.startsWith("/") ? (
              <Link to={item.href} rel={item.nofollow ? "nofollow" : ""}>
                {item.text}
              </Link>
            ) : (
              <a
                href={item.href}
                target={item.newTab ? "_blank" : "_self"}
                rel={item.nofollow ? "nofollow" : ""}
              >
                {item.text}
              </a>
            )}
          </p>
        ))}
    </div>
  </div>
)
