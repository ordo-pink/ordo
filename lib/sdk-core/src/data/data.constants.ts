/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace DATA {
	export enum TAG_COLOR {
		GRAY,
		AMBER,
		BLUE,
		CYAN,
		EMERALD,
		FUCHSIA,
		GREEN,
		INDIGO,
		LIME,
		ORANGE,
		PINK,
		PURPLE,
		RED,
		ROSE,
		SKY,
		TEAL,
		VIOLET,
		YELLOW,
		length,
	}

	export enum PERSISTENCE_LOCATION {
		DEFAULT,
		REMOTE_ONLY,
		LOCAL_ONLY,
		length,
	}

	export enum PERMISSION {
		___,
		__X,
		_W_,
		_WX,
		R__,
		R_X,
		RW_,
		RWX,
		length,
	}
}
