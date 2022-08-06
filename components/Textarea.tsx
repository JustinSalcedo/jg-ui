import { ChangeEventHandler, useEffect, useRef } from "react";
import utilStyles from '../styles/utils.module.css'

export default function Textarea({ text, handler, placeholder } : { text: string, handler: ChangeEventHandler, placeholder?: string }) {
    const ref = useRef(null)

    useEffect(() => {
        (ref.current as HTMLTextAreaElement).focus()
    }, [])

    return (
        <>
            <textarea onChange={handler} value={text} placeholder={placeholder || ''} ref={ref} className={utilStyles['hide-scrollbar']}></textarea>
            {/* @ts-ignore */}
            <style jsx>{`
                textarea {
                    width: 100%;
                    height: 100%;
                    padding: 1rem;
                    font-size: .75rem;
                    line-height: 1.5;
                    border: none;
                }

                textarea:focus, textarea:focus-visible {
                    outline: none;
                    border: 1px solid gray;
                }
            `}</style>
        </>
    )
}