// import { add, format, parse, startOfToday } from "date-fns"
// import { useState } from "react"
// import { BsChevronLeft, BsChevronRight, BsArrowClockwise } from "react-icons/bs"
// import Month from "./month"

// export default function MonthView() {
//   const today = startOfToday()

//   const currentMonth = format(today, "MM yyyy")

//   const [selectedMonth, setSelectedMonth] = useState(currentMonth)

//   const selectedMonthDate = parse(selectedMonth, "MM yyyy", new Date())

//   const handlePreviousMonthClick = () => {
//     const firstDayNextMonth = add(selectedMonthDate, { months: -1 })
//     setSelectedMonth(format(firstDayNextMonth, "MM yyyy"))
//   }

//   const handleNextMonthClick = () => {
//     const firstDayNextMonth = add(selectedMonthDate, { months: 1 })
//     setSelectedMonth(format(firstDayNextMonth, "MM yyyy"))
//   }

//   const handleCurrentMonthClick = () => {
//     setSelectedMonth(currentMonth)
//   }

//   return (
//     <div className={`p-8`}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4 py-8">
//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             onClick={handlePreviousMonthClick}
//           >
//             <BsChevronLeft />
//           </button>

//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             onClick={handleCurrentMonthClick}
//           >
//             <BsArrowClockwise />
//           </button>

//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             onClick={handleNextMonthClick}
//           >
//             <BsChevronRight />
//           </button>
//         </div>
//       </div>

//       <Month month={selectedMonth} />
//     </div>
//   )
// }
