// import { add, format, parse, startOfToday } from "date-fns"
// import { useState } from "react"
// import { BsChevronLeft, BsChevronRight, BsArrowClockwise } from "react-icons/bs"
// import Day from "./day"

// export default function DayView() {
//   const today = startOfToday()

//   const currentDay = format(today, "dd mm")

//   const [selectedDay, setSelectedDay] = useState(currentDay)

//   const selectedDayDate = parse(selectedDay, "dd mm", new Date())

//   console.log(selectedDayDate)
//   // const handlePreviousDayClick = () => {}

//   // const handleNextDayClick = () => {}

//   // const handleCurrentDayClick = () => {
//   //   setSelectedDay(currentDay)
//   // }

//   return (
//     <div className={`p-8`}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4 py-8">
//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             // onClick={handlePreviousDayClick}
//           >
//             <BsChevronLeft />
//           </button>

//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             // onClick={handleCurrentDayClick}
//           >
//             <BsArrowClockwise />
//           </button>

//           <button
//             className="rounded-md bg-slate-200 px-4 py-2"
//             // onClick={handleNextDayClick}
//           >
//             <BsChevronRight />
//           </button>
//         </div>
//       </div>

//       <Day day={selectedDay} />
//     </div>
//   )
// }
