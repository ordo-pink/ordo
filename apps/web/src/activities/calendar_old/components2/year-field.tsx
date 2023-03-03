// /* eslint-disable react/jsx-no-duplicate-props */
// import { format, parse, startOfToday } from "date-fns"
// import { useState } from "react"
// import { BsArrowClockwise, BsChevronLeft, BsChevronRight } from "react-icons/bs"
// import Month from "./month"

// export default function YearView() {
//   const today = startOfToday()
//   const currentYear = format(today, "yyyy")

//   const [selectedYear, setSelectedYear] = useState(currentYear)

//   // const selectedYearDate = parse(selectedYear, "yyyy", new Date())

//   const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

//   const handlePreviousYearClick = () => {
//     setSelectedYear(String(Number(selectedYear) - 1))
//   }

//   const handleNextMonthClick = () => {
//     setSelectedYear(String(Number(selectedYear) + 1))
//   }

//   const handleCurrentMonthClick = () => {
//     setSelectedYear(currentYear)
//   }

//   // function previousMonth() {
//   //   const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
//   //   setSelectedYear(format(firstDayNextMonth, "yyyy"))
//   // }

//   // function nextMonth() {
//   //   const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
//   //   setSelectedYear(format(firstDayNextMonth, "yyyy"))
//   // }

//   return (
//     <div className="p-4 md:px-32 lg:px-64">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4 py-8">
//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             onClick={handlePreviousYearClick}
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

//       <div className="flex items-center mt-4">
//         <h2 className="ml-2 text-xl font-bold leading-none">{selectedYear}</h2>
//       </div>
//       <div className="w-full grid grid-cols-4 grid-rows-3 gap-4 md:gap-8">
//         {months.map((_, index) => (
//           <Month
//             key={index}
//             isYearView
//             month={`${months[index]} ${selectedYear}`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
