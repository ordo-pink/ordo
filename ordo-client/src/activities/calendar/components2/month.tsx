// import { parse, isToday, endOfMonth, addDays, eachDayOfInterval } from "date-fns"
// import { useTranslation } from "react-i18next"

// type Props = {
//   month: string
//   isYearView?: boolean
// }

// export default function Month({ month, isYearView }: Props) {
//   const firstDayCurrentMonth = parse(month, "MM yyyy", new Date())
//   const lastDayCurrentMonth = endOfMonth(firstDayCurrentMonth)

//   const firstDayOfTheWeekCurrentMonth = firstDayCurrentMonth.getDay()
//   const lastDayOfTheWeekCurrentMonth = lastDayCurrentMonth.getDay()

//   const days = eachDayOfInterval({
//     start: addDays(firstDayCurrentMonth, -firstDayOfTheWeekCurrentMonth),
//     end: addDays(lastDayCurrentMonth, 6 - lastDayOfTheWeekCurrentMonth),
//   })

//   const { t } = useTranslation()

//   const translatedMon = t("@ordo-activity-calendar/mon")
//   const translatedTue = t("@ordo-activity-calendar/tue")
//   const translatedWed = t("@ordo-activity-calendar/wed")
//   const translatedThu = t("@ordo-activity-calendar/thu")
//   const translatedFri = t("@ordo-activity-calendar/fri")
//   const translatedSat = t("@ordo-activity-calendar/sat")
//   const translatedSun = t("@ordo-activity-calendar/sun")

//   const translatedMonth = t(`@ordo-activity-calendar/month-${month.slice(0, 2)}`)

//   return (
//     <div>
//       <h2 className="text-xl font-bold">
//         {translatedMonth} {month.slice(3)}
//       </h2>

//       <div className="grid grid-cols-7 text-xs uppercase text-neutral-500">
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedSun}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedMon}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedTue}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedWed}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedThu}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedFri}
//         </div>
//         <div className={`text-center ${isYearView ? "" : "border-[0.5px] border-neutral-300"}`}>
//           {translatedSat}
//         </div>
//       </div>

//       <div className="flex-grow grid w-full h-auto grid-cols-7 grid-rows-6">
//         {days.map((day) => (
//           <div
//             key={day.toLocaleDateString()}
//             className={`flex flex-col group ${
//               isYearView ? "h-16" : "h-10 md:h-32"
//             } border-[0.5px] border-neutral-300  md:p-2 ${
//               day.getMonth() === parse(month, "MM yyyy", new Date()).getMonth()
//                 ? "bg-neutral-50 text-neutral-700"
//                 : isYearView
//                 ? "opacity-0"
//                 : "bg-slate-100 text-slate-400"
//             }`}
//           >
//             <div className="text-xs">
//               <div
//                 className={`flex flex-col items-center justify-center p-1 w-6 ${
//                   isToday(day) ? "rounded-full bg-pink-700 text-neutral-100" : ""
//                 }`}
//               >
//                 {day.getDate()}
//               </div>
//             </div>
//             <div className="flex flex-col px-1 py-1 overflow-auto"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
