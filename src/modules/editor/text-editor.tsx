import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { MdLine, MdToken } from "@utils/md-parser";
import { Switch } from "or-else";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";
import remarkWikiLink from "remark-wiki-link";
import remarkGfm from "remark-gfm";
import { wikiLinkEmbeds, attachIds, groupByLines } from "@utils/remark-extensions";

const Wrapper = (line: MdLine) =>
	Switch.of(line)
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
		.case("wikiLink", ({ children }: any) => (
			<a href="#" className="underline text-pink-600">
				[[{children}]]
			</a>
		))
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
		<>
			<div className={`flex items-center`}>
				<div
					contentEditable={false}
					className="w-12 select-none self-stretch flex items-center flex-shrink-0 justify-end border-r border-neutral-200 dark:border-neutral-600 text-right pr-2 font-mono text-neutral-500 dark:text-neutral-400 text-sm"
				>
					{line.number ?? " "}
				</div>
				<div className={` px-2 w-full`}>
					{line.children && (
						<LineWrapper>
							{line.children.map((token: any) => (
								<Token key={token.id} token={token} />
							))}
						</LineWrapper>
					)}
				</div>
			</div>
		</>
	);
};

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();
	const path = useAppSelector((state) => state.editor.currentTab);
	const currentTab = useAppSelector((state) => state.editor.tabs.find((tab) => tab.path === path));

	const [json, setJson] = React.useState({ children: [] });

	React.useEffect(() => {
		const processor = unified().use(remarkParse).use(remarkGfm).use(remarkWikiLink);
		const ast = processor.parse(currentTab?.raw);
		const transformed = unified().use(wikiLinkEmbeds).use(groupByLines).use(attachIds).run(ast);
		transformed.then((data) => setJson(data as any));
	}, [currentTab && currentTab.raw && currentTab.data]);

	if (!currentTab) {
		return null;
	}

	return (
		<Scrollbars>
			<div>
				{json.children.map((line: any) => (
					<Line key={line.number} line={line} />
				))}
			</div>
		</Scrollbars>
	);
};
