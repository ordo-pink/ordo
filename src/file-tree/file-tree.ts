import type { OrdoFile, OrdoFileWithBody, OrdoFolder } from "./types";

import { produce } from "immer";
import { Either, IEither } from "or-else";

import { createFile } from "./file/create-file";
import { getFile } from "./file/get-file";
import { updateFile } from "./file/update-file";
import { getFolder } from "./folder/get-folder";
import { updateFolder } from "./folder/update-folder";
import { createFolder } from "./folder/create-folder";
import { deleteFolder } from "./folder/delete-folder";
import { deleteFile } from "./file/delete-file";
import { getParent } from "./common/get-parent";
import { getAncestors } from "./common/get-ancestors";

export const isOrdoFolder = (x: any): x is OrdoFolder =>
	x.type && x.type === "folder" && x.children && Array.isArray(x.children);
export const isOrdoFile = (x: any): x is OrdoFile => x.type && x.type !== "folder";
export const isOrdoFileWithBody = (x: any): x is OrdoFileWithBody =>
	x.body && typeof x.body === "string" && isOrdoFile(x);

const fromError = <T>(x: T | Error): IEither<T, Error> =>
	x instanceof Error ? Either.left(x) : Either.right(x);

export interface IFileTree {
	concat: (otherTree: IFileTree) => IEither<IFileTree, null>;
	getRoot: () => IEither<OrdoFolder, null>;
	getParent: <T extends OrdoFolder | OrdoFile>(
		node: T,
	) => IEither<T extends OrdoFolder | OrdoFile ? OrdoFolder : OrdoFolder, null>;
	getSiblings: (node: OrdoFile | OrdoFolder) => IEither<Array<OrdoFile | OrdoFolder>, null>;
	getAncestors: (node: OrdoFile | OrdoFolder) => IEither<OrdoFolder[], null>;
	// getLinks
	// getNodes
	createPhysicalFile: (path: string) => Promise<IEither<IFileTree, Error>>;
	getFile: <K extends keyof OrdoFile>(key: K, value: OrdoFile[K]) => IEither<OrdoFile, null>;
	updateFile: (path: string, update: (file: OrdoFile) => void) => IEither<IFileTree, null>;
	// moveFile
	deleteFile: (file: OrdoFile) => IEither<IFileTree, null>;
	createPhysicalFolder: (path: string) => Promise<IEither<IFileTree, Error>>;
	getFolder: <K extends keyof OrdoFolder>(
		key: K,
		value: OrdoFolder[K],
	) => IEither<OrdoFolder, null>;
	updateFolder: (path: string, update: (folder: OrdoFolder) => void) => IEither<IFileTree, null>;
	// moveFolder
	deleteFolder: (folder: OrdoFolder) => IEither<IFileTree, null>;
	// createBranch
	// createVirtualBranch
	// toBranch(virtualBranch)
	// createVirtualFile
	// toFile(virtualFile)
	// createVirtualFolder
	// toFolder(virtualFolder)
}

export const FileTree = {
	of: (folder: OrdoFolder): IFileTree => fileTree(folder),
	// from([links], [nodes])
};

const fileTree = (tree: OrdoFolder): IFileTree => ({
	concat: (other) =>
		other
			.getRoot()
			.map((otherTree) => mergeTrees(tree, otherTree))
			.map(FileTree.of),
	getRoot: () => Either.fromNullable(tree),
	getParent: (node) => Either.fromNullable(getParent(tree, node)),
	getSiblings: (node) =>
		FileTree.of(tree)
			.getParent(node)
			.map((parent) => parent.children)
			.map((children) => children.filter((child) => child.path !== node.path)),
	getAncestors: (node) => Either.fromNullable(getAncestors(tree, node)),
	createPhysicalFile: (path) =>
		createFile(path, tree.path).then((file) =>
			fromError(file)
				.chain((file) => FileTree.of(tree).getParent(file))
				.chain((parent) =>
					FileTree.of(tree)
						.updateFolder(parent.path, (state) => state.children.push(file))
						.chain((tree) =>
							tree.updateFile(file.path, (state: any) => (state.depth = parent.depth + 1)),
						),
				),
		),
	getFile: (key, value) => Either.fromNullable(getFile(tree, key, value)),
	updateFile: (path, update) =>
		Either.fromNullable(updateFile(tree, path, update)).map(FileTree.of),
	deleteFile: (file) => Either.fromNullable(deleteFile(tree, file.path)).map(FileTree.of),
	createPhysicalFolder: (path) =>
		createFolder(path, tree.path).then((folder) =>
			fromError(folder)
				.chain((folder) => FileTree.of(tree).getParent(folder))
				.chain((parent) =>
					FileTree.of(tree)
						.updateFolder(parent.path, (state) => state.children.push(folder))
						.chain((tree) =>
							tree.updateFolder(folder.path, (state: any) => (state.depth = parent.depth + 1)),
						),
				),
		),
	getFolder: (key, value) => Either.fromNullable(getFolder(tree, key, value)),
	updateFolder: (path, update) =>
		Either.fromNullable(updateFolder(tree, path, update)).map(FileTree.of),
	deleteFolder: (node) => Either.fromNullable(deleteFolder(tree, node.path)).map(FileTree.of),
});

const mergeTrees = (tree: OrdoFolder, other: OrdoFolder) =>
	produce(tree, (state) => {
		const treeNode = getFolder(state, "path", other.path);

		if (!treeNode) {
			return null;
		}

		treeNode.children = treeNode.children.concat(other.children);
	});
