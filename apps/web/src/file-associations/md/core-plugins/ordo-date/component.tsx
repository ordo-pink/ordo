import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { Nullable } from "@ordo-pink/common-types"
import { $getNodeByKey } from "lexical"
import { useEffect, useRef, useState } from "react"
import { BsCalendarDate } from "react-icons/bs"
import DatePicker from "tui-date-picker"

import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"

type Props = {
  date: Date
  nodeKey: string
}

export const DateComponent = ({ date, nodeKey }: Props) => {
  const datePickerRef = useRef<HTMLDivElement>(null)
  const [editor] = useLexicalComposerContext()
  const [picker, setPicker] = useState<Nullable<DatePicker>>(null)
  const [currentDate, setCurrentDate] = useState(date)

  useEffect(() => {
    if (!picker) return

    picker.on("change", () => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        node && node.setDate(picker.getDate())
        setCurrentDate(picker.getDate())
      })
    })
  }, [picker, editor, nodeKey])

  useEffect(() => {
    if (!datePickerRef.current) return

    setPicker(new DatePicker(datePickerRef.current, { date }))
  }, [datePickerRef, date])

  return (
    <span className="rounded-lg shadow-md px-4 py-0.5 bg-slate-200">
      <span>{currentDate.toLocaleDateString()}</span>
      <BsCalendarDate
        className="inline align-bottom ml-2 mb-1 cursor-pointer"
        onClick={() => picker && picker.open()}
      />
      <span ref={datePickerRef}></span>
    </span>
  )
}
