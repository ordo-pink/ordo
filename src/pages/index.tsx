import React from "react"

import { Seo } from "../components/seo"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Seo title="Добро пожаловать в Ordo" />
      <Header />
      <div className="grow max-w-7xl mx-auto">
        <section className="flex flex-col items-center text-center space-y-4 p-4 md:flex-row flex-nowrap md:space-y-0 md:justify-between md:pt-32">
          <div>
            <h1 className="text-5xl font-black max-w-xl">
              Помогаем беречь и преумножать знания
            </h1>
            <h2 className="text-2xl py-16 md:py-8 max-w-xl">
              Ordo помогает упорядочить знания и работать с ними в том виде,
              который подходит именно вам
            </h2>
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              to="/download"
              className="px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white whitespace-nowrap"
            >
              Скачать бесплатно*
            </Link>
            <p className="text-neutral-500">
              * - всё верно, без регистрации и смс
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center py-16 mx-auto max-w-5xl justify-center p-4 text-center">
          <h3 className="text-2xl font-extrabold">Преимущества</h3>

          <div className="flex flex-col space-y-8 mb-8 lg:flex-row lg:items-center lg:space-x-4 lg:text-left">
            <div>
              <h4 className="text-xl font-bold my-4">
                Новое - это забытое старое
              </h4>
              <p className="max-w-[500px] mx-auto">
                Помните, текст хранился в файликах, а файлики собирались в
                папочки? А нам и вспоминать не надо! Ordo хранит всю вашу
                информацию на вашем компьютере в виде текстовых файлов. Главное,
                не потеряйте компьютер!
              </p>
            </div>
            <StaticImage
              className="rounded-xl mt-8 shadow-xl"
              src="../../assets/file-explorer.png"
              alt="Новое - это забытое старое"
            />
          </div>

          <div className="flex flex-col space-y-8 mb-8 lg:flex-row lg:items-center lg:space-x-4 lg:text-left">
            <div>
              <h4 className="text-xl font-bold my-4">Мир строится на связях</h4>
              <p className="max-w-[500px] mx-auto">
                Как говорил Остин Клион в своей книге "Воруй как художник",
                креативность - это не открытие нового, а связывание
                существующего. Мы сделали так, чтобы создание связей было
                простым и удобным. А Graph View поможет вам посмотреть на свои
                знания с высоты птичьего полёта.
              </p>
            </div>
            <StaticImage
              className="rounded-xl mt-8 shadow-xl"
              src="../../assets/graph-view.png"
              alt="Мир строится на связях"
            />
          </div>

          <div className="flex flex-col space-y-8 mb-8 lg:flex-row lg:items-center lg:space-x-4 lg:text-left">
            <div>
              <h4 className="text-xl font-bold my-4">Как на ладони</h4>
              <p className="max-w-[500px] mx-auto">
                Канбан - это статусно. Потому что в нём есть статусы. Вот такие
                формулировки у нас здесь, да. Проходите, присаживайтесь. С нами
                не соскучишься. Зато с канбан-доской удобно формулировать и
                отслеживать прогресс.
              </p>
            </div>
            <StaticImage
              className="rounded-xl mt-8 shadow-xl"
              src="../../assets/kanban.png"
              alt="Как на ладони"
            />
          </div>

          <div className="flex flex-col space-y-8 mb-8">
            <div>
              <h4 className="text-xl font-bold my-4 text-center">
                Это ваши данные
              </h4>
              <p className="max-w-[500px]">
                Для нас, безопасность - это высшая ценность. Мы не передаём вашу
                информацию сторонним компаниям. Мы не храним на серверах ваши
                данные в незашифрованном виде.
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-8 mb-16">
            <div>
              <h4 className="text-xl font-bold my-4 text-center">
                Бесплатно навсегда
              </h4>
              <p className="max-w-[500px]">
                Приложение Ordo доступно для скачивания абсолютно бесплатно. Вам
                даже не нужно создавать аккаунт - достаточно просто установить и
                начать приводить мысли в порядок!
              </p>
            </div>
          </div>

          <Link
            to="/download"
            className="px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white"
          >
            Уговорили, скачать
          </Link>
        </section>
        {/* <section>
          <h3>В разработке</h3>
          <div>
            <h4>
              Шаг вперёд <span>Скоро!</span>
            </h4>
            <p>Ачивки</p>
          </div>
          <div>
            <h4>
              Каждому своё <span>Скоро!</span>
            </h4>
            <p>Кастомизация</p>
          </div>
          <div>
            <h4>
              Нет смысла повторять <span>Скоро!</span>
            </h4>
            <p>Вкладывание документов</p>
          </div>
          <div>
            <h4>
              Вместе веселее <span>Скоро!</span>
            </h4>
            <p>Командная работа</p>
          </div>
          <button>Скачать уже</button>
        </section> */}
        {/* <section>
          <h3>Цены</h3>
          <div>Ordo (бесплатно навсегда)</div>
          <div>Ordo+</div>
        </section> */}
      </div>
      <Footer />
    </div>
    // <Layout>
    //   <Seo title="Home" />
    //   <div>
    //     <h1 className="text-4xl">Ordo</h1>
    //     {/* <StaticImage
    //       src="../images/example.png"
    //       loading="eager"
    //       width={64}
    //       quality={95}
    //       formats={["auto", "webp", "avif"]}
    //       alt=""
    //     /> */}
    //   </div>
    //   <Footer />
    // </Layout>
  )
}
