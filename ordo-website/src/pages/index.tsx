import React from "react"

import { Seo } from "../components/seo"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { DownloadButton } from "../components/download-button"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title="Заметки для быстрой, объёмной, удобной работы"
        description="Ordo - это система управления знаниями для вас, вашей команды, и всего человечества."
      />
      <div className="site-container">
        <Header />

        <main className="main">
          <section className="hero">
            <div className="hero__container">
              <div className="hero__social">
                <a
                  href="https://twitter.com/ordo_pink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  Twitter
                </a>
                <a
                  href="https://t.me/ordo_pink_ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  Telegram
                </a>
              </div>

              <div className="hero__content">
                <h2 className="hero__title">ORDO.PINK v 0.2.0-alpha</h2>

                <p>
                  Мы собрали различные функции для удобной работы с текстом.{" "}
                  <strong>Ordo подойдёт всем</strong>, от занятого
                  контентмейкера до учителя в школе. А главное — бесплатно
                </p>

                <DownloadButton />
              </div>
            </div>

            <div className="hero__bg">
              <picture>
                <source
                  media="(max-width: 1024px)"
                  srcSet="/img/hero/hero-bg-mobile.svg"
                />
                <img
                  className="image"
                  src="/img/hero/hero-bg.svg"
                  width="1920"
                  height="1400"
                  alt="фон"
                  decoding="async"
                />
              </picture>
            </div>
          </section>

          <section className="about">
            <div className="about__container">
              <h2 className="visually-hidden">Новое - это забытое старое</h2>

              <div className="about__info info">
                <p className="info__text">
                  Помните, текст хранился в файликах, а файлики собирались в
                  папочки?
                </p>
                <p className="info__notice">А нам и вспоминать не надо!</p>
                <div className="info__decor"></div>
              </div>

              <StaticImage
                src="../../assets/file-explorer.png"
                alt="File Explorer"
                decoding="async"
                className="image rotate-[-15deg]"
              />

              <div className="about__description description">
                <p className="description__text">
                  <strong>Ordo</strong> хранит всю информацию на вашем
                  компьютере в виде текстовых файлов
                </p>
                <p className="description__notice">
                  Главное, не потеряйте компьютер!
                </p>
              </div>
            </div>
          </section>

          <section className="graph">
            <div className="graph__container">
              <h2 className="graph__title">Мир Строится На связях</h2>
              <div className="graph__content">
                <div className="graph__info info">
                  <p className="info__text">
                    Как учил Остин Клион в своей книге{" "}
                    <b>«Кради как художник»</b>, креативность — это не открытие
                    нового, а связывание существующего.
                  </p>
                  <div className="info__decor"></div>

                  <p className="info__description">
                    Мы сделали так, чтобы создание связей было
                    <strong> простым и удобным</strong>
                  </p>
                </div>

                <div className="graph__ostin blur-md">
                  <picture>
                    <source
                      media="(max-width: 1024px)"
                      srcSet="/img/graph/ostin-mobile.webp"
                      type="image/webp"
                    />
                    <source srcSet="/img/graph/ostin.webp" type="image/webp" />
                    <source
                      media="(max-width: 1024px)"
                      srcSet="/img/graph/ostin-mobile.png"
                    />
                    <img
                      className="image"
                      src="/img/graph/ostin.png"
                      width="997"
                      height="624"
                      alt="Остин Клион"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>

              <StaticImage
                src="../../assets/graph-view.png"
                alt="Graph View"
                decoding="async"
                className="image rotate-[-15deg]"
              />

              <div className="graph__description description">
                <p className="description__text">
                  А <strong>Graph View</strong> поможет вам посмотреть на свои
                  знания с высоты птичьего полёта
                </p>
              </div>
            </div>
          </section>

          <section className="kanban">
            <div className="kanban__container">
              <h2 className="kanban__title">Как на ладони</h2>
              <div className="kanban__info info">
                <p className="info__text">
                  Канбан — это статусно. Потому что в нём есть статусы. Вот
                  такие формулировки у нас здесь, да.
                </p>
                <div className="info__decor"></div>
              </div>
              <div className="kanban__chair">
                <picture>
                  <source srcSet="/img/kanban/chair.webp" type="image/webp" />
                  <img
                    className="image"
                    src="/img/kanban/chair.jpg"
                    width="274"
                    height="213"
                    alt="Фото стула"
                    decoding="async"
                  />
                </picture>
                <p className="kanban__notice z-50">
                  Проходите, присаживайтесь. С нами не соскучишься
                </p>
              </div>
              <StaticImage
                src="../../assets/kanban.png"
                alt="Kanban"
                decoding="async"
                className="image rotate-[-15deg] mt-10"
              />

              <div className="kanban__description description">
                <p className="description__text">
                  Зато с <strong>канбан-доской</strong> удобно формировать и
                  отслеживать прогресс
                </p>
              </div>
            </div>
          </section>

          <section className="advantage">
            <div className="advantage__container">
              <div className="advantage__bg">
                <h2 className="advantage__title">
                  ORDO заметки для быстрой, объёмной, удобной работы
                </h2>
              </div>

              <div className="advantage__content">
                <div className="advantage__logo">
                  <picture>
                    <source
                      media="(max-width: 1024px)"
                      srcSet="/img/advantage/logo-mobile.webp"
                      type="image/webp"
                    />
                    <source
                      srcSet="/img/advantage/logo.webp"
                      type="image/webp"
                    />
                    <source
                      media="(max-width: 1024px)"
                      srcSet="/img/advantage/logo-mobile.png"
                    />
                    <img
                      className="image"
                      src="/img/advantage/logo.png"
                      width="499"
                      height="141"
                      alt="Ordo.pink v 0.1.1 - alpha"
                      decoding="async"
                    />
                  </picture>
                </div>
                <ul className="advantage__list">
                  <li className="advantage__item">
                    <h3 className="advantage__heading">Это ваши данные</h3>
                    <p className="advantage__text">
                      Для нас, безопасность — это высшая ценность. Мы{" "}
                      <strong>не передаём вашу информацию</strong> сторонним
                      компаниям и не храним на серверах ваши данные в
                      незашифрованном виде
                    </p>
                  </li>

                  <li className="advantage__item">
                    <h3 className="advantage__heading">Бесплатно навсегда</h3>
                    <p className="advantage__text">
                      Приложение <strong>Ordo</strong> доступно для скачивания{" "}
                      <strong>абсолютно бесплатно</strong>. Вам даже не нужно
                      создавать аккаунт — достаточно просто установить и начать
                      приводить мысли в порядок!
                    </p>
                  </li>
                </ul>

                <DownloadButton />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}
