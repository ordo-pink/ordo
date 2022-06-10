import { isNodeWithChars } from "@core/parser/is";
import { NodeWithChildren, NodeWithChars } from "@core/parser/types";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "@modules/text-parser/enums";

export const visit = (
	node: NodeWithChildren | NodeWithChars,
	saved: {
		tags: string[];
		embeds: string[];
		links: string[];
		todos: {
			done: string[];
			pending: string[];
		};
	} = { tags: [], embeds: [], links: [], todos: { done: [], pending: [] } },
) => {
	if (isNodeWithChars(node)) {
		if (node.type === TextNodeWithCharsType.TAG && !saved.tags.includes(node.data.tag as string) && node.data.tag) {
			saved.tags.push(node.data.tag as string);
		} else if (
			node.type === TextNodeWithCharsType.EMBED &&
			!saved.embeds.includes(node.data.relativePath as string) &&
			node.data.relativePath
		) {
			saved.embeds.push(node.data.relativePath as string);
		} else if (
			node.type === TextNodeWithCharsType.LINK &&
			!saved.links.includes(node.data.href as string) &&
			node.data.href
		) {
			saved.links.push(node.data.href as string);
		}
	} else {
		if (node.type === TextNodeWithChildrenType.TODO) {
			node.raw.startsWith("[ ] ") ? saved.todos.pending.push(node.raw.slice(4)) : saved.todos.done.push(node.raw.slice(4));
		}

		node.children.forEach((child) => visit(child as any, saved));
	}

	return saved;
};
