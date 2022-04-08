import React from "react";
import { Switch } from "or-else";
import Scrollbars from "react-custom-scrollbars";

import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { MdLine, MdToken } from "@utils/md-parser";
import { Breadcrumbs } from "./breadcrumbs";
import { openTab, parseMarkdown } from "./editor-slice";
import { useCurrentTab } from "./hooks";
import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";
import { findOrdoFileBy } from "@modules/file-explorer/file-tree/find-ordo-file-by";
import { createFile } from "@modules/file-explorer/file-explorer-slice";

const Wrapper = (line: MdLine) =>
	Switch.of(line)
		.case(
			(x) => x.type === "thematicBreak",
			() => <hr className="border-2 border-gray-400" />,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 1,
			({ children }: any) => <h1 className="text-4xl"># {children}</h1>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 2,
			({ children }: any) => <h2 className="text-3xl">## {children}</h2>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 3,
			({ children }: any) => <h3 className="text-2xl">### {children}</h3>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 4,
			({ children }: any) => <h4 className="text-xl">#### {children}</h4>,
		)
		.case(
			(x) => x.type === "heading" && x.depth === 5,
			({ children }: any) => <h5 className="text-lg">##### {children}</h5>,
		)
		.case(
			(x) => x.type === "listItem",
			({ children }: any) => <li>{children}</li>,
		)
		.case(
			(x) => x.type === "blockquote",
			({ children }: any) => (
				<blockquote className="pl-2 border-l-4 border-gray-500">
					{">"} {children}
				</blockquote>
			),
		)
		.case(
			(x) => x.type === "br",
			() => <br />,
		)
		.default(({ children }: any) => <div>{children}</div>);

const TokenWrapper = (tokenType: string) =>
	Switch.of(tokenType)
		.case("delete", ({ children }: any) => <span className="line-through">~~{children}~~</span>)
		.case("emphasis", ({ children }: any) => <em className="italic">_{children}_</em>)
		.case("wikiLink", ({ children }: any) => {
			const dispatch = useAppDispatch();
			const tree = useAppSelector((state) => state.fileExplorer.tree);

			const [node, setNode] = React.useState<any>();

			if (!tree) {
				return null;
			}

			React.useEffect(() => {
				setNode(findOrdoFileBy(tree, "relativePath", `./${children.includes(".") ? children : `${children}.md`}`));
			});

			const color = node ? "text-pink-600" : "text-gray-600";

			return (
				<a
					href="#"
					className={`underline ${color}`}
					onClick={() => {
						if (!node) {
							dispatch(createFile({ tree, path: `${children.includes(".") ? children : `${children}.md`}` })).then(
								(action) => {
									setNode(
										findOrdoFileBy(
											action.payload as any,
											"relativePath",
											`./${children.includes(".") ? children : `${children}.md`}`,
										),
									);

									console.log(action.payload);
									dispatch(openTab((node as any).path));
								},
							);
						} else {
							dispatch(openTab((node as any).path));
						}
					}}
				>
					[[{children}]]
				</a>
			);
		})
		.case("wikiLinkEmbed", ({ children }: any) => <span className="text-pink-500 text-xs">{children}</span>)
		.case("inlineCode", ({ children }: any) => (
			<code className="bg-rose-200 text-sm text-rose-700 rounded-lg px-2 py-0.5 font-mono">`{children}`</code>
		))
		.case("strong", ({ children }: any) => <strong className="font-bold">**{children}**</strong>)
		.default(({ children }: any) => <span>{children}</span>);

const Token: React.FC<{ token: MdToken }> = ({ token }) => {
	const Component = TokenWrapper(token.type);

	return (
		<Component>
			{token.children ? token.children.map((child) => <Token key={child.id} token={child} />) : token.value}
		</Component>
	);
};

const Line: React.FC<{ line: MdLine }> = ({ line }) => {
	if (line.type === "list" && !line.ordered) {
		return (
			<ul className=" list-disc list-inside">
				{line.children?.map((child) => (
					<Line key={child.id} line={child as any} />
				))}
			</ul>
		);
	}

	if (line.type === "list" && line.ordered) {
		return (
			<ol className=" list-decimal list-inside">
				{line.children?.map((child) => (
					<Line key={child.id} line={child as any} />
				))}
			</ol>
		);
	}

	const LineWrapper = Wrapper(line);

	return (
		<div className={`flex items-center whitespace-nowrap h-7`}>
			<div
				contentEditable={false}
				className="w-12 select-none self-stretch flex items-center flex-shrink-0 justify-end border-r border-neutral-200 dark:border-neutral-600 text-right pr-2 font-mono text-neutral-500 dark:text-neutral-400 text-sm"
			>
				{line.number ?? " "}
			</div>
			<div className={` px-2 w-full`}>
				{line.type === "thematicBreak" ? (
					<hr />
				) : (
					line.children && (
						<LineWrapper>
							{line.children.map((token: any) => (
								<Token key={token.id} token={token} />
							))}
						</LineWrapper>
					)
				)}
			</div>
		</div>
	);
};

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();

	const { tab } = useCurrentTab();

	React.useEffect(() => {
		if (tab && !tab.data) {
			dispatch(parseMarkdown(tab));
		}
	}, [tab && tab.data, tab?.data]);

	return (
		tab && (
			<>
				<div className="w-full text-sm text-gray-500">
					<Breadcrumbs />
				</div>
				<Scrollbars>
					<div className="cursor-text pb-[100%]">
						{tab.data && tab.data.children.map((line: any) => <Line key={line.id} line={line} />)}
					</div>
				</Scrollbars>
			</>
		)
	);
};
