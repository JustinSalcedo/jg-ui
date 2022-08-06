import { Editor, Text, Transforms } from "slate"
import { CustomEditor, CustomElement, CustomText } from "../types/index";

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
    }
}

const EditorHelpers = {
    // Style marks: Bold, italic, or underline

    isStyleMarkActive(editor: Editor, style: 'bold' | 'italic' | 'underline') {
        const [match] = Editor.nodes(editor, {
            match: (n: CustomText) => n[style] === true,
            universal: true,
        }) as unknown as [boolean]
    
        return !!match
    },

    toggleStyleMark(editor: Editor, style: 'bold' | 'italic' | 'underline') {
        const isActive = EditorHelpers.isStyleMarkActive(editor, style)
        Transforms.setNodes(
            editor,
            { [style]: isActive ? null : true },
            { match: (n: CustomText) => Text.isText(n), split: true }
        )
    },
  
  
    // Text blocks
    isCodeBlockActive(editor: Editor) {
        const [match] = Editor.nodes(editor, {
            match: (n: CustomElement) => n.type === 'code',
        }) as unknown as [boolean]
    
        return !!match
    },
  
    toggleCodeBlock(editor: Editor) {
        const isActive = EditorHelpers.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: (n: CustomText) => Editor.isBlock(editor, n) }
        )
    },

    isHeadingBlockActive(editor: Editor) {
        const [match] = Editor.nodes(editor, {
            match: (n: CustomElement) => n.type === 'heading',
        }) as unknown as [boolean]
    
        return !!match
    },
  
    toggleHeadingBlock(editor: Editor) {
        const isActive = EditorHelpers.isHeadingBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'heading' },
            { match: (n: CustomText) => Editor.isBlock(editor, n) }
        )
    },
}

export default EditorHelpers