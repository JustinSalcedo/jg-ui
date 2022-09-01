import { KeyboardEvent, UIEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react";
import { DEFAULT_DRAFT } from "../../../constants/index";
import EditorHelpers from "../../../lib/EditorHelpers";
import { CustomEditor, CustomElement, CustomText, ParagraphElement } from "../../../types/IEditor";
import styles from './RichTextEditor.module.css'
import utilStyles from '../../../styles/utils.module.css'

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}

export default function RichTextEditor({ content, handler, readOnly, scrollTop, handleScroll }: {
    content: Descendant[], handler: (content: Descendant[]) => void
    readOnly?: boolean, scrollTop?: number, handleScroll?: (e: UIEvent<HTMLDivElement>) => void
}) {
    const initialValue = useMemo(() => content || DEFAULT_DRAFT, [])
    const [editor] = useState(() => withReact(createEditor()))

    const ref = useRef(null as HTMLDivElement)

    useEffect(() => {
        if (scrollTop) ref.current.scrollTo({ top: scrollTop })
    }, [content.length])

    function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (readOnly && !(e.ctrlKey && e.key === 'c')) return e.preventDefault()
        if (e.ctrlKey) {
            switch (e.key) {
                case '`':
                    e.preventDefault()
                    EditorHelpers.toggleCodeBlock(editor)
                    break;
                
                case '1':
                    e.preventDefault()
                    EditorHelpers.toggleHeadingBlock(editor)
            
                case 'b':
                    e.preventDefault()
                    EditorHelpers.toggleStyleMark(editor, 'bold')
                    break;
            
                case 'i':
                    e.preventDefault()
                    EditorHelpers.toggleStyleMark(editor, 'italic')
                    break;
        
                case 'u':
                    e.preventDefault()
                    EditorHelpers.toggleStyleMark(editor, 'underline')
                    break;
            }
        } else {
            if (e.key === 'Tab') {
                e.preventDefault()
                editor.insertText('\t')
            }
        }
    }

    function onChange(value: Descendant[]) {
        const isAstChange = editor.operations.some(
            op => op.type !== 'set_selection'
        )
        // If anything besides the selection was changed
        if (isAstChange) {
            handler(value)
        }
        return false
    }

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'heading':
                return <HeadingElement {...props} />
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        return <Leaf {...props} />
    }, [])

    return (
        <Slate editor={editor} value={initialValue} onChange={onChange} >
            <div ref={ref} onScroll={handleScroll} className={styles.container + ' ' + utilStyles['hide-scrollbar']}>
                <Editable onKeyDown={onKeyDown} renderElement={renderElement} renderLeaf={renderLeaf} />
            </div>
        </Slate>
    )
}

function CodeElement({ children, attributes }: RenderElementProps) {
    return (
        <pre {...attributes}>
            <code>{children}</code>
        </pre>
    )
}

function HeadingElement({ children, attributes }: RenderElementProps) {
    return <h1 className={styles.h1} {...attributes} >{children}</h1>
}

function DefaultElement({ children, attributes, element }: RenderElementProps) {
    return <p className={styles.element} {...attributes} style={{ textAlign: (element as ParagraphElement).align || 'left' }} >{children}</p>
}

function Leaf({ children, attributes, leaf }: RenderLeafProps) {
    return (
        <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal', textDecoration: leaf.underline ? 'underline' : 'none', fontStyle: leaf.italic ? 'italic' : 'normal' }} >
            {children}
        </span>
    )
}