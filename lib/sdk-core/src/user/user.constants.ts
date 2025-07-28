/** Only used for highlighting paying users so that they feel it was worth paying (it was not). */
export enum SUBSCRIPTION {
	FREE,
	PERSONAL,
	FAMILY,
	TEAM,
	ENTERPRISE,
	length,
}

export namespace RX {
	export const HANDLE = /^[a-z0-9_]{1,23}$/

	export const EMAIL =
		// eslint-disable-next-line no-useless-escape
		/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

	export const FUNCTION_NAME = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/
}
