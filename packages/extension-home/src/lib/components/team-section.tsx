import { useTranslation } from "react-i18next"
import AleksandrKonovalov from "../assets/aleksandr-konovalov.jpg"
import AndreiOrlov from "../assets/andrei-orlov.jpg"
import AntonLaptev from "../assets/anton-laptev.jpg"
import KonstantinTsepelev from "../assets/konstantin-tsepelev.jpg"
import SergeiOrlov from "../assets/sergei-orlov.jpg"
import TimurGafiulin from "../assets/timur-gafiulin.jpg"

const team = [
  {
    name: "sergei-orlov",
    role: "Founder / End-to-end Developer / R2D2",
    imageUrl: SergeiOrlov,
  },
  {
    name: "konstantin-tsepelev",
    role: "Co-Founder / Back-end Developer / H2SO4",
    imageUrl: KonstantinTsepelev,
  },
  {
    name: "andrei-orlov",
    role: "Co-Founder / Dead-end Developer / C3PO",
    imageUrl: AndreiOrlov,
  },
  {
    name: "nikolai-gromov",
    role: "Front-end Developer / C2H5OH",
    imageUrl: paint,
  },
  {
    name: "ilia-balenko",
    role: "Marketsman / H3PO4",
    imageUrl: paint,
  },
  {
    name: tAleksandrKonovalov,
    role: "Front-end Developer",
    imageUrl: AleksandrKonovalov,
  },
  {
    name: tAntonLaptev,
    role: "QA / FAQ",
    imageUrl: AntonLaptev,
  },
  {
    name: tTimurGafiulin,
    role: "Front-end Developer / 10K",
    imageUrl: TimurGafiulin,
  },
]

export default function TeamSection() {
  const { t } = useTranslation("home")

  const tSergeiOrlov = t()
  const tKonstantinTsepelev = t()
  const tAndreiOrlov = t()
  const tNikolaiGromov = t()
  const tIliaBalenko = t()
  const tAleksandrKonovalov = t("aleksandr-konovalov")
  const tAntonLaptev = t("anton-laptev")
  const tTimurGafiulin = t("timur-gafiulin")

  const tTeam = t("ordo-team")
  const tTeamDescription = t("ordo-team-description")

  return (
    <section className="py-32 pt-40">
      <div className="mx-auto grid max-w-7xl gap-y-20 gap-x-8 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{tTeam}</h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            {tTeamDescription}
          </p>
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
                  <h3 className="text-base font-semibold leading-7 tracking-tight">
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
  )
}
