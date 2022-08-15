import * as HiIcons from "react-icons/hi";

import { EventHandler } from "@core/transmission";
import { OrdoEvents } from "@init/types";

export type int = number;
export type uint = number;
export type float = number;

export type UnaryFunction<TArgument, TResult> = (arg: TArgument) => TResult;
export type Thunk<TResult> = UnaryFunction<never, TResult>;

export type OrdoEventHandler<TKey extends keyof OrdoEvents> = EventHandler<OrdoEvents[TKey]>;

export type OrdoEvent<TScope extends string = string, TEvent extends string = string, TPayload = null> = Record<
  `@${TScope}/${TEvent}`,
  TPayload
>;

export type SupportedIcon = keyof typeof HiIcons;
