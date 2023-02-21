// import { format } from "date-fns"

// type Props = {
//   day: string
//   isWeekView?: boolean
// }

// export default function DayView({ day, isWeekView }: Props) {
//   const currentTime = format(new Date(), "PPPP")

//   const hours = new Array(24).fill(null).map((_, index) => `${index <= 9 ? "0" : ""}${index}:00`)

//   return (
//     <div className="flex items-center flex-col">
//       <div className="flex place-content-start">{currentTime}</div>
//       <div className="max-w-2xl w-full">
//         {hours.map((hour) => (
//           <div
//             key={hour}
//             className="flex text-neutral-500 w-full border-b"
//           >
//             <div className="p-2 text-xs">{hour}</div>
//             <div className="flex-grow p-2">
//               <div className="grid grid-cols-1 grid-rows-2">
//                 <div className="border-b-[0.5px] border-dashed h-10"></div>
//                 <div></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
