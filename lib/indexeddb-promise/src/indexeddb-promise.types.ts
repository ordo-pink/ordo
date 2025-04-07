/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type IDBCursorWithValue<T = any> = IDBCursor & { value: T }

export type TIndexedDBObjectStorePromise = {
	add: <T>(value: T, key: IDBValidKey) => Promise<IDBValidKey>
	clear: () => Promise<void>
	count: (query?: IDBValidKey | IDBKeyRange) => Promise<number>
	delete: (query: IDBValidKey | IDBKeyRange) => Promise<void>
	get: <T = any>(query: IDBValidKey | IDBKeyRange) => Promise<T>
	get_all: <T = any>(query?: IDBValidKey | IDBKeyRange | null, count?: number) => Promise<T[]>
	get_all_keys: (query?: IDBValidKey | IDBKeyRange | null, count?: number) => Promise<IDBValidKey[]>
	get_key: (query: IDBValidKey | IDBKeyRange) => Promise<IDBValidKey | undefined>
	put: <T>(value: T, key?: IDBValidKey) => Promise<IDBValidKey>
	// create_index: (name: string, keyPath: string | string[], options?: IDBIndexParameters) => Promise<IDBIndex>
	// delete_index: (name: string) => void
	// index: (name: string) => IDBIndex
	// open_cursor: <T>(
	// 	query?: IDBValidKey | IDBKeyRange | null,
	// 	direction?: IDBCursorDirection,
	// ) => Promise<IDBCursorWithValue<T> | null>
	// open_key_cursor: (query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection) => Promise<IDBCursor | null>
}

export type TIndexedDBObjectStorePromiseStatic = {
	Of: (store: IDBObjectStore) => TIndexedDBObjectStorePromise
}
