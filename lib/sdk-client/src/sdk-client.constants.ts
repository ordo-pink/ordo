/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CLIENT {
	export const SM_SCREEN_BREAKPOINT = 640
}

export namespace MODAL {
	export enum SIZE {
		SM,
		MD,
		LG,
		XL,
		XXL,
	}
}

export namespace COMMAND_PALETTE {
	export const FUZZY_CHECK_RATIO = 0.7

	export enum ITEM_TYPE {
		PAGE_OPENER,
		MODAL_OPENER,
		FILE_CREATOR,
		AUTOMATION_ACTION,
		COMMON_ACTION,
		INFORMATION,
		DESTRUCTIVE_ACTION,
		length,
	}

	export enum SECTION {
		ITEMS,
		PINNED_ITEMS,
	}
}

export namespace ACHIEVEMENT {
	export enum CATEGORY {
		EDUCATION,
		COLLECTION,
		CHALLENGE,
		LEGACY,
		length,
	}
}

export namespace CONTEXT_MENU {
	/**
	 * Context menu item type. This impacts two things:
	 *
	 * 1. Grouping items in the context menu.
	 * 2. Given type can be hidden when showing context menu.
	 */
	export enum ITEM_TYPE {
		CREATE,
		READ,
		UPDATE,
		DELETE,
		length,
	}
}

export namespace BACKGROUND_TASK {
	export enum STATUS {
		NONE,
		SAVING,
		LOADING,
		length,
	}
}

export namespace NOTIFICATION {
	export enum TYPE {
		DEFAULT,
		SUCCESS,
		INFO,
		WARN,
		QUESTION,
		RRR,
		length,
	}
}
