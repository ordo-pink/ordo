import { firstMatched, negate } from "@ordo-pink/tau"
import { is_lbl, is_lnk } from "./metadata-validations"
import { FSID } from "./data.types"

type TGetWrongLabelFn = (labels: string[]) => string | undefined
export const get_wrong_label: TGetWrongLabelFn = firstMatched<string>(negate(is_lbl))

type TGetWrongLinkFn = (links: FSID[]) => FSID | undefined
export const get_wrong_link: TGetWrongLinkFn = firstMatched<FSID>(negate(is_lnk))
