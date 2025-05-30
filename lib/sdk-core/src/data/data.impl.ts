export namespace data {
	export enum TAG_COLOR {
		GRAY,
		RED,
		ORANGE,
		AMBER,
		YELLOW,
		LIME,
		GREEN,
		EMERALD,
		TEAL,
		CYAN,
		SKY,
		BLUE,
		INDIGO,
		VIOLET,
		PURPLE,
		FUCHSIA,
		PINK,
		ROSE,
		length,
	}

	export const DEFAULT_TAG_COLOR = TAG_COLOR.GRAY

	export enum PERMISSION {
		__X = 0o1,
		_W_ = 0o2,
		_WX = 0o3,
		R__ = 0o4,
		R_X = 0o5,
		RW_ = 0o6,
		RWX = 0o7,
	}
}
