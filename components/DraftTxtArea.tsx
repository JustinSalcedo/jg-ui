import { ChangeEventHandler } from "react";

export default function ResumeTxtArea({ text, handler } : { text: string, handler: ChangeEventHandler }) {
    return (
        <>
            <textarea onChange={handler} value={text}></textarea>
            {/* @ts-ignore */}
            <style jsx>{`
                textarea {
                    width: 100%;
                    height: 100%;
                    padding: 1rem;
                    font-size: .75rem;
                    line-height: 1.5;
                    // border: none;
                }
            `}</style>
        </>
    )
}