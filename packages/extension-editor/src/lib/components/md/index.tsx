import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ExecuteCommandFn, FSDriver, IOrdoFile } from "@ordo-pink/common-types"
import { useCommands, useFsDriver } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"
import { EditorState, EditorThemeClasses, LexicalNode } from "lexical"
import { debounce } from "lodash"
import { mergeDeepWith } from "ramda"
import { useEffect, useState, memo } from "react"
import { useTranslation } from "react-i18next"
import { LoadEditorStatePlugin } from "./load-state"

const debouncedSave = debounce(
  (
    driver: FSDriver,
    file: IOrdoFile,
    nodes: LexicalNode[],
    content: string,
    emit: ExecuteCommandFn,
  ) => {
    let metadata = {}

    const draft = createDraft(file)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes.forEach((child: any) => {
      if (child.ordoMetadata) {
        metadata = mergeDeepWith(
          (a, b) => (Array.isArray(a) ? a.concat(b) : b ? b : a),
          metadata,
          child.ordoMetadata,
        )
      }
    })

    draft.metadata = metadata

    const newFile = finishDraft(draft)

    emit("fs.update-file", newFile)
    // eslint-disable-next-line no-console
    driver.files.setContent({ file, content }).catch(console.error)
  },
  1000,
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNodeArray = (tree: any) =>
  tree.children.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any[], child: any) =>
      child.children ? acc.concat(toNodeArray(child)) : acc.concat([child]),
    [],
  )

const theme: EditorThemeClasses = {
  heading: {
    h1: "font-extrabold text-5xl",
    h2: "font-extrabold text-4xl",
    h3: "font-extrabold text-3xl",
    h4: "font-extrabold text-2xl",
    h5: "font-extrabold text-xl",
  },
  list: {
    ul: "list-inside list-disc",
    ol: "list-inside list-decimal",
  },
  link: "text-sky-700 visited:text-purple-700",
  // paragraph: "",
  hashtag: "text-pink-600 dark:text-pink-400",
  text: {
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
    bold: "font-bold",
    italic: "italic",
  },
  quote:
    "border-l border-b border-slate-400 dark:border-slate-600 p-4 max-w-xl text-sm rounded-bl-lg",
  code: "block px-6 py-4 bg-stone-100 dark:bg-stone-800 max-w-xl my-8 shadow-lg rounded-lg",
  codeHighlight: {
    atrule: "text-neutral-500",
    attr: "text-neutral-500",
    boolean: "text-orange-700",
    builtin: "text-emerald-600 font-bold",
    cdata: "text-neutral-400",
    char: "text-emerald-600",
    class: "text-emerald-900",
    "class-name": "text-emerald-900",
    comment: "text-neutral-400",
    constant: "text-orange-700",
    deleted: "text-orange-700",
    doctype: "text-neutral-400",
    entity: "text-stone-600",
    function: "text-emerald-900",
    important: "text-neutral-600",
    inserted: "text-emerald-600",
    keyword: "text-neutral-500",
    namespace: "text-neutral-600",
    number: "text-orange-700",
    operator: "text-stone-600",
    prolog: "text-neutral-400",
    property: "text-orange-700",
    punctuation: "text-neutral-400",
    regex: "text-neutral-600",
    selector: "text-emerald-600",
    string: "text-emerald-600",
    symbol: "text-orange-700",
    tag: "text-orange-700",
    url: "text-stone-600",
    variable: "text-neutral-600",
  },
}

// TODO: Adding nodes
const initialNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  HashtagNode,
]

type Props = {
  file: IOrdoFile
}

const Placeholder = () => {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation("editor")

  const tPlaceholder = t("placeholder")

  return (
    <div
      style={{ marginTop: "-1.5rem" }}
      className=" text-neutral-500"
      onClick={() => editor && editor.focus()}
    >
      {tPlaceholder}
    </div>
  )
}

export default memo(
  function MdEditor({ file }: Props) {
    // const { nodes, plugins, transformers } = useAppSelector((state) => state.app.editor)
    const { emit } = useCommands()
    const driver = useFsDriver()

    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Prevent from updating the file at the moment it is opened
    useEffect(() => {
      setIsInitialLoad(true)

      setTimeout(() => setIsInitialLoad(false), 1000)

      return () => {
        setIsInitialLoad(true)
      }
    }, [file.path])

    const handleChange = (state: EditorState) => {
      if (isInitialLoad) return

      state.read(() => {
        if (!driver) return

        const content = $convertToMarkdownString(TRANSFORMERS)
        // const content = $convertToMarkdownString(transformers.concat(TRANSFORMERS))

        const nodes = toNodeArray(state.toJSON().root)

        debouncedSave(driver, file, nodes, content, emit)
      })
    }

    // eslint-disable-next-line no-console
    const onError = console.error

    return (
      // <div className="p-4 w-full h-full">
      <div className="py-2 pl-2">
        <LexicalComposer
          initialConfig={{
            namespace: "md-editor-root",
            onError,
            theme,
            // nodes: nodes.concat(initialNodes),
            nodes: initialNodes,
          }}
        >
          {/* <div className="mb-8"> */}
          {/* <PathBreadcrumbs path={breadcrumbsPath} /> */}

          {/* <h1 className="text-3xl font-black">{file.readableName}</h1> */}
          {/* </div> */}

          {/* <div className="w-full h-screen flex flex-col items-center"> */}
          {/* <div className="w-full py-8 px-4"> */}
          {/* <OrdoDatePlugin /> */}

          {/* <MarkdownShortcutPlugin transformers={transformers.concat(TRANSFORMERS)} /> */}
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

          <LinkPlugin />
          <ListPlugin />
          <CheckListPlugin />

          <HashtagPlugin />
          <HistoryPlugin />
          <HorizontalRulePlugin />

          <CheckListPlugin />

          <RichTextPlugin
            contentEditable={
              <ContentEditable
                title="Editor"
                spellCheck={false}
              />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />

          <LoadEditorStatePlugin
            file={file}
            transformers={TRANSFORMERS}
            // transformers={transformers.concat(TRANSFORMERS)}
          />
          <OnChangePlugin
            ignoreSelectionChange
            onChange={handleChange}
          />

          {/* {plugins.map((Plugin, index) => (
                <Plugin key={index} />
              ))} */}
          {/* </div> */}
          {/* </div> */}
        </LexicalComposer>
        {/* </div> */}
      </div>
    )
  },
  (prev, next) => prev.file.path === next.file.path,
)
