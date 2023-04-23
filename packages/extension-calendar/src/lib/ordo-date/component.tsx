import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { $getNodeByKey, $getSelection } from "lexical"
import { useEffect, useRef, useState } from "react"
import { BsCalendarDate } from "react-icons/bs"
import DatePicker from "tui-date-picker"

import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"
import "./component.css"

type Props = {
  startDate: Date
  endDate: Nullable<Date>
  nodeKey: string
}

const timePickerOptions = {
  inputType: "spinbox",
  showMeridiem: false,
}

export const DateComponent = ({ startDate, endDate, nodeKey }: Props) => {
  const [editor] = useLexicalComposerContext()

  const startDatePickerRef = useRef<HTMLSpanElement>(null)
  const endDatePickerRef = useRef<HTMLSpanElement>(null)

  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [isTimePickerEnabled] = useState(true)
  const [isEndDatePickerEnabled] = useState(true)
  const [isSelected, setIsSelected] = useState(false)

  const [startDatePicker, setStartDatePicker] = useState<Nullable<DatePicker>>(null)
  const [endDatePicker, setEndDatePicker] = useState<Nullable<DatePicker>>(null)

  const [currentStartDate, setCurrentStartDate] = useState<Date>(startDate)
  const [currentEndDate, setCurrentEndDate] = useState<Nullable<Date>>(endDate)

  useEffect(() => {
    if (!startDatePicker) return

    const shouldShowStartDatePicker = isPickerVisible
    const shouldShowEndDatePicker = shouldShowStartDatePicker && isEndDatePickerEnabled

    if (!startDatePicker.isOpened() && shouldShowStartDatePicker) {
      startDatePicker.open()
    }

    if (startDatePicker.isOpened() && !shouldShowStartDatePicker) {
      startDatePicker.close()
    }

    if (!endDatePicker) return

    if (!endDatePicker.isOpened() && shouldShowEndDatePicker) {
      endDatePicker.open()
    }

    if (endDatePicker.isOpened() && !shouldShowEndDatePicker) {
      endDatePicker.close()
    }
  }, [startDatePicker, endDatePicker, isEndDatePickerEnabled, isPickerVisible])

  useEffect(() => {
    if (!startDatePicker) return

    startDatePicker.on("change", () => {
      setCurrentStartDate(startDatePicker.getDate())
    })

    startDatePicker.on("close", () => {
      setIsPickerVisible(false)
    })
  }, [startDatePicker])

  useEffect(() => {
    if (!endDatePicker) return

    endDatePicker.on("change", () => {
      setCurrentEndDate(endDatePicker.getDate())
    })

    endDatePicker.on("close", () => {
      setIsPickerVisible(false)
    })
  }, [endDatePicker])

  useEffect(() => {
    if (!editor) return

    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        const node = $getNodeByKey(nodeKey)

        const parentKey = node?.getParent()?.getKey()

        if (!node || !selection || !parentKey) {
          setIsSelected(false)
          return
        }

        const parent = $getNodeByKey(parentKey)

        const isSelected =
          selection.getNodes().includes(node) || (parent && selection.getNodes().includes(parent))

        setIsSelected(Boolean(isSelected))
      })
    })
  }, [editor])

  useEffect(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)

      node && node["setDate"](currentStartDate, currentEndDate)
    })
  }, [editor, currentStartDate, currentEndDate, nodeKey])

  useEffect(() => {
    if (!startDatePickerRef.current) return

    if (!startDatePicker) {
      setStartDatePicker(
        new DatePicker(startDatePickerRef.current, {
          date: startDate,
          timePicker: isTimePickerEnabled ? timePickerOptions : false,
          autoClose: false,
          weekStartDay: "1",
          usageStatistics: false,
        }),
      )
    } else {
      startDatePicker.setDate(currentStartDate)
    }
  }, [startDatePickerRef, currentStartDate, isTimePickerEnabled, startDate, startDatePicker])

  useEffect(() => {
    if (!endDatePickerRef.current) return

    if (!endDatePicker) {
      setEndDatePicker(
        new DatePicker(endDatePickerRef.current, {
          date: endDate || new Date(Date.now()),
          timePicker: isTimePickerEnabled ? timePickerOptions : false,
          autoClose: false,
          weekStartDay: "1",
          usageStatistics: false,
        }),
      )
    } else {
      endDatePicker.setDate(currentEndDate as Date)
    }
  }, [
    endDatePickerRef,
    currentEndDate,
    isTimePickerEnabled,
    endDate,
    endDatePicker,
    currentStartDate,
  ])

  return Either.fromBoolean(!isSelected).fold(
    () => (
      <span>
        {currentStartDate
          .toISOString()
          .concat(currentEndDate ? `>>>${currentEndDate.toISOString()}` : "")}
      </span>
    ),
    () => (
      <span className="rounded-lg shadow-md px-4 py-0.5 bg-slate-200 dark:bg-slate-800 whitespace-nowrap">
        <span>
          {currentStartDate.toLocaleDateString()}
          {currentStartDate.toTimeString().startsWith("00:00:00 ")
            ? null
            : ` ${currentStartDate.toLocaleTimeString()}`}
        </span>
        {currentEndDate ? (
          <span>
            {" — "}
            {currentEndDate.toLocaleDateString()}{" "}
            {currentEndDate.toTimeString().startsWith("00:00:00 ")
              ? null
              : currentEndDate.toLocaleTimeString()}
          </span>
        ) : null}
        <BsCalendarDate
          className="inline align-bottom ml-2 mb-1 cursor-pointer"
          onClick={() => setIsPickerVisible(true)}
        />
        <span
          className={`relative bg-neutral-200 w-[900px] ${isPickerVisible} ? "block" : "hidden"`}
        >
          <span
            className={`absolute top-5 whitespace-normal left-[-400px]`}
            ref={startDatePickerRef}
          />
          <span
            className={`absolute top-5 whitespace-normal left-[-400px] ml-[275px]`}
            ref={endDatePickerRef}
          />
        </span>
      </span>
    ),
  )
}
