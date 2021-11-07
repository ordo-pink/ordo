export type Color = "default" | "blue" | "green" | "yellow" | "red" | "orange" | "purple" | "pink"

const supportedColors = ["default", "blue", "green", "yellow", "red", "orange", "purple", "pink"]

export const isValidColor = (color: any): color is Color =>
	typeof color === "string" && supportedColors.includes(color)

export const getColor = (color: any): Color => (isValidColor(color) ? color : "default")
