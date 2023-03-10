import { TRANSFORMERS } from "@lexical/markdown"
import { ORDO_DATE_TRANSFORMER } from "./core-plugins/ordo-date/transformer"

export const ORDO_TRANSFORMERS = [ORDO_DATE_TRANSFORMER, ...TRANSFORMERS]
