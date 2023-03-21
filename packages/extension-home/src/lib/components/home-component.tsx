import { OrdoButtonPrimary, OrdoButtonSecondary, useCommands } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import {
  BsArrowsFullscreen,
  BsCalendar,
  BsChevronDown,
  BsCodeSlash,
  BsKanban,
  BsLink45Deg,
  BsLock,
  BsMarkdown,
  BsSafe,
} from "react-icons/bs"
import Feature from "./feature"
import KeyPrinciple from "./key-principle"
import heroBg from "../assets/bg.jpg"
import paint from "../assets/paint.jpg"
import appDark from "../assets/rich-editor-1.png"
import app from "../assets/rich-editor-2.png"

// TODO: Update screenshots

export default function Home() {
  const { t } = useTranslation("home")

  const { execute } = useCommands()

  const handleGetStarted = () => execute("auth.register", "/")
  const handleLogin = () => execute("auth.login", "/")

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

  const tTitle = t("title")
  const tSlogan = t("slogan")
  const tDescription = t("description")
  const tLearnMore = t("learn-more")
  const tGetStarted = t("start-using")
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

  return (
    <div className="overflow-x-hidden">
      <div className="relative w-screen">
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
              <h1 className="text-5xl px-8 font-bold text-neutral-900 md:text-7xl">
                <span>{tSlogan} </span>
                <span className="bg-gradient-to-tr from-purple-700 via-pink-700 to-violet-700 text-transparent bg-clip-text drop-shadow-md ">
                  {tTitle}
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-800">{tDescription}</p>
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
      </div>

      <div className="py-24">
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
      </div>

      <div className="overflow-hidden py-24">
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
      </div>

      <div className="mx-auto max-w-7xl py-24 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-neutral-900 to-emerald-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <img
            className="absolute top-0 left-0 right-0 bottom-0 w-full"
            src={paint}
            alt="Paint"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tl from-yellow-400 to-orange-800 opacity-95" />
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left z-10">
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

              <OrdoButtonSecondary
                className="text-white hover:ring-white uppercase text-lg"
                onClick={() => console.log("TODO")}
              >
                {tLearnMore}
              </OrdoButtonSecondary>
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
      </div>
    </div>
  )
}
