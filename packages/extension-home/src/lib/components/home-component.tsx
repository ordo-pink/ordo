import { OrdoButtonPrimary, OrdoButtonSecondary, useCommands } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import {
  BsArrowsFullscreen,
  BsCalendar,
  BsChevronDown,
  BsCodeSlash,
  BsGithub,
  BsKanban,
  BsLink45Deg,
  BsLock,
  BsMarkdown,
  BsSafe,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs"
import Feature from "./feature"
import KeyPrinciple from "./key-principle"
import PricingPlan from "./pricing-plan"
import heroBg from "../assets/bg.jpg"
import paint from "../assets/paint.jpg"
import appDark from "../assets/rich-editor-1.png"
import app from "../assets/rich-editor-2.png"

import "./home-component.css"

// TODO: Update screenshots

export default function Home() {
  const { t } = useTranslation("home")

  const { execute } = useCommands()

  const handleGetStarted = () => execute("auth.register", "/")
  const handleLogin = () => execute("auth.login", "/")
  const handleGithubClick = () =>
    execute("router.open-external", { url: "https://github.com/ordo-pink" })
  const handleTelegramClick = () =>
    execute("router.open-external", { url: "https://t.me/ordo_pink_ru" })
  const handleTwitterClick = () =>
    execute("router.open-external", { url: "https://twitter.com/ordo_pink" })

  const includedFeatures = ["asdf"]

  const keyPrinciples = [
    { title: "security-title", Icon: BsLock, description: "security-description" },
    { title: "ownership-title", Icon: BsSafe, description: "ownership-description" },
    { title: "oss-title", Icon: BsCodeSlash, description: "oss-description" },
    { title: "extend-title", Icon: BsArrowsFullscreen, description: "extend-description" },
  ]

  const features = [
    { title: "calendar-title", Icon: BsCalendar, description: "calendar-description" },
    { title: "kanban-title", Icon: BsKanban, description: "kanban-description" },
    { title: "md-title", Icon: BsMarkdown, description: "md-description" },
    { title: "linking-title", Icon: BsLink45Deg, description: "linking-description" },
  ]

  const team = [
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Leslie Alexander",
      role: "Co-Founder / CEO",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ]

  const tTitle = t("title")
  const tSlogan = t("slogan")
  const tDescription = t("description")
  const tLearnMore = t("learn-more")
  const tGetStarted = t("get-started")
  const tLogin = t("login")
  const tHeadlineNews = t("headline-news")
  const tKeyPrinciples = t("key-principles")
  const tKeyPrinciplesExtended = t("key-principles-extended")
  const tKeyPrinciplesDescription = t("key-principles-description")
  const tFeatures = t("features")
  const tFeaturesExtended = t("features-extended")
  const tFeaturesDescription = t("features-description")
  const tCta = t("cta")
  const tCtaExtended = t("cta-extended")
  const tCtaDescription = t("cta-description")
  const tPricing = t("pricing")
  const tPricingDescription = t("pricing-description")
  const tTeam = t("team")
  const tTeamDescription = t("team-description")
  const tRightsReserved = t("all-rights-reserved")

  return (
    <div className="overflow-x-hidden">
      <header className="relative w-screen">
        <img
          className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
          src={heroBg}
          alt="Gradient"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-neutral-200 opacity-10 dark:opacity-80" />

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-42">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-neutral-600 ring-1 ring-neutral-900/10 hover:ring-neutral-900/20 transition-all duration-300">
                {tHeadlineNews}{" "}
                <a
                  href="#"
                  className="font-semibold"
                >
                  <span className="absolute inset-0" />
                  {tLearnMore}
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl px-8 font-bold md:font-black text-neutral-900 md:text-7xl">
                <span>{tSlogan} </span>
                <span className="bg-gradient-to-tr from-purple-700 via-pink-700 to-violet-700 text-transparent bg-clip-text drop-shadow-md ">
                  {tTitle}
                </span>
              </h1>
              <p className="mt-6 font-semibold text-lg leading-8 text-neutral-800">
                {tDescription}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <OrdoButtonPrimary
                  className="uppercase text-lg md:text-base font-semibold"
                  inverted
                  onClick={handleGetStarted}
                >
                  {tGetStarted}
                </OrdoButtonPrimary>

                <OrdoButtonSecondary
                  className="uppercase text-lg md:text-base"
                  onClick={handleLogin}
                >
                  {tLogin}
                </OrdoButtonSecondary>
              </div>
            </div>
          </div>
          <div className="py-2 flex justify-center text-neutral-500">
            <BsChevronDown />
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-rose-700">{tKeyPrinciples}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {tKeyPrinciplesExtended}
            </p>
            <p className="mt-6 text-lg leading-8 text-neutral-600">{tKeyPrinciplesDescription}</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {keyPrinciples.map(({ title, Icon, description }) => (
                <KeyPrinciple
                  key={title}
                  title={title}
                  Icon={Icon}
                  description={description}
                />
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-orange-700">{tFeatures}</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                  {tFeaturesExtended}
                </p>
                <p className="mt-6 text-lg leading-8 text-neutral-600">{tFeaturesDescription}</p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-neutral-600 lg:max-w-none">
                  {features.map(({ title, Icon, description }) => (
                    <Feature
                      key={title}
                      title={title}
                      Icon={Icon}
                      description={description}
                    />
                  ))}
                </dl>
              </div>
            </div>
            <img
              src={app}
              alt="Product screenshot"
              className="dark:hidden w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-neutral-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />

            <img
              src={appDark}
              alt="Product screenshot"
              className="hidden dark:inline-block w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-neutral-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-24 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-neutral-900 to-emerald-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <img
            className="absolute top-0 left-0 right-0 bottom-0 w-full -z-10"
            src={paint}
            alt="Paint"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tl from-yellow-400 to-orange-800 opacity-95 -z-10" />
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left z-30">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {tCta}
              <br />
              {tCtaExtended}
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-300">{tCtaDescription}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <OrdoButtonPrimary
                inverted
                className="text-lg uppercase font-semibold"
                onClick={handleGetStarted}
              >
                {tGetStarted}
              </OrdoButtonPrimary>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              className="absolute top-0 left-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              src={appDark}
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-transparent to-emerald-300 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {tPricing}
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">{tPricingDescription}</p>
          </div>

          <div className="mx-auto bg-white shadow-lg mt-16 max-w-2xl rounded-3xl ring-1 ring-green-300 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <PricingPlan
              features={includedFeatures}
              title="free"
              description="free-description"
              price="free-price"
            />
          </div>

          <div className="mx-auto bg-white shadow-lg mt-16 max-w-2xl rounded-3xl ring-1 ring-green-300 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <PricingPlan
              features={includedFeatures}
              title="pro"
              description="pro-description"
              price="pro-price"
            />
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="custom-shape-divider-top-1679427882">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>

      <section className="py-32 pt-40">
        <div className="mx-auto grid max-w-7xl gap-y-20 gap-x-8 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {tTeam}
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">{tTeamDescription}</p>
          </div>
          <ul
            role="list"
            className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
          >
            {team.map((person, i) => (
              <li key={person.name + i}>
                <div className="flex items-center gap-x-6">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={person.imageUrl}
                    alt=""
                  />
                  <div>
                    <h3 className="text-base font-semibold leading-7 tracking-tight text-neutral-900">
                      {person.name}
                    </h3>
                    <p className="text-sm font-semibold leading-6 text-cyan-600">{person.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bg-gradient-to-tr sm:bg-gradient-to-r from-sky-800 via-slate-800 to-purple-900 rounded-lg shadow-lg m-4 text-neutral-200">
        <div className="w-full mx-auto container md:p-6 p-4 flex flex-col md:flex-row gap-6 items-center md:justify-between">
          <span className="text-sm text-neutral-200 sm:text-center dark:text-neutral-200">
            © {new Date(Date.now()).getFullYear()} Ordo.pink. {tRightsReserved}.
          </span>
          <ul className="flex items-center gap-6 mt-3 text-2xl text-neutral-200 dark:text-neutral-200 sm:mt-0">
            <li>
              <OrdoButtonSecondary
                className="text-2xl text-neutral-200"
                onClick={handleGithubClick}
              >
                <BsGithub />
              </OrdoButtonSecondary>
            </li>

            <li>
              <OrdoButtonSecondary
                className="text-2xl text-neutral-200"
                onClick={handleTwitterClick}
              >
                <BsTwitter />
              </OrdoButtonSecondary>
            </li>

            <li>
              <OrdoButtonSecondary
                className="text-2xl text-neutral-200"
                onClick={handleTelegramClick}
              >
                <BsTelegram />
              </OrdoButtonSecondary>
            </li>
          </ul>
          <ul className="flex flex-wrap mt-3 text-sm text-neutral-200 sm:mt-0">
            <li>
              <a
                href="#"
                className="mr-4 hover:underline md:mr-6 text-neutral-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="mr-4 hover:underline md:mr-6 text-neutral-300"
              >
                Licensing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline text-neutral-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
