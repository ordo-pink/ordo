// /* eslint-disable react/jsx-no-duplicate-props */
// import {
//   add,
//   eachDayOfInterval,
//   endOfMonth,
//   format,
//   getDay,
//   isEqual,
//   isSameDay,
//   isSameMonth,
//   isToday,
//   parse,
//   parseISO,
//   startOfToday,
// } from "date-fns"
// import { useState } from "react"

// export default function WeekView() {
//   const today = startOfToday()
//   const [selectedDay, setSelectedDay] = useState(today)
//   const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
//   const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

//   const days = eachDayOfInterval({
//     start: firstDayCurrentMonth,
//     end: endOfMonth(firstDayCurrentMonth),
//   })

//   function previousMonth() {
//     const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
//   }

//   function nextMonth() {
//     const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
//     setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
//   }

//   return (
//     <div className="flex flex-grow overflow-auto w-screen h-screen">
//       <div className="flex flex-col flex-grow">
//         <div className="flex items-center mt-4">
//           <h2 className="ml-2 text-xl font-bold leading-none">Somemonth</h2>
//         </div>
//         <div className="grid grid-cols-7 mt-4">
//           <div className="pl-1 text-sm">Mon</div>
//           <div className="pl-1 text-sm">Tue</div>
//           <div className="pl-1 text-sm">Wed</div>
//           <div className="pl-1 text-sm">Thu</div>
//           <div className="pl-1 text-sm">Fri</div>
//           <div className="pl-1 text-sm">Sat</div>
//           <div className="pl-1 text-sm">Sun</div>
//         </div>
//         <div className="grid flex-grow w-full h-auto grid-cols-7 grid-rows-5 gap-px pt-px mt-1 bg-gray-200">
//           <div></div>
//           <div className="relative flex flex-col bg-white group">
//             <span className="mx-2 my-1 text-xs font-bold">1</span>
//             <div className="flex flex-col px-1 py-1 overflow-auto"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
