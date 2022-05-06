import * as HiIcons from "react-icons/hi";
import { IconType } from "react-icons/lib";

export const useIcon = (name?: keyof typeof HiIcons): IconType =>
	name ? (HiIcons as Record<keyof typeof HiIcons, IconType>)[name] : ((() => null) as unknown as IconType);
