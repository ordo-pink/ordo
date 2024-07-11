import { first_matched, negate } from "@ordo-pink/tau"
import { is_label, is_link } from "./metadata-validations"
import { type FSID } from "./data.types"

type TGetWrongLabelFn = (labels: string[]) => string | undefined
export const get_wrong_label: TGetWrongLabelFn = first_matched<string>(negate(is_label))

type TGetWrongLinkFn = (links: FSID[]) => FSID | undefined
export const get_wrong_link: TGetWrongLinkFn = first_matched<FSID>(negate(is_link))
