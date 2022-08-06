// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
// import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor // & HistoryEditor

export type CodeElement = {
    type: 'code'
    children: CustomText[]
}

export type ParagraphElement = {
    type: 'paragraph'
    children: CustomText[]
    align?: 'left' | 'center' | 'right'
}

export type HeadingElement = {
    type: 'heading'
    level: number
    children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement | CodeElement

export type FormattedText = { text: string; bold?: true, italic?: true, underline?: true }

export type CustomText = FormattedText

// declare module 'slate' {
//   interface CustomTypes {
//     Editor: CustomEditor
//     Element: CustomElement
//     Text: CustomText
//   }
// }