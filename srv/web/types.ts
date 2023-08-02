export type Slashless<Str> = Str extends `${string}/${string}` ? never : Str

export type Activity<Str extends string = string> = {
	name: Slashless<Str>
	version: string
	background: boolean
}
