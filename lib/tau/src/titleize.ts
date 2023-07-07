export const titleize = (str: string) => {
	const chars = str.split("")

	return chars[0]
		.toLocaleUpperCase()
		.concat(...chars.slice(1).map(char => char.toLocaleLowerCase()))
}
