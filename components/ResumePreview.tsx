import { useEffect, useRef, useState } from "react"
import { textToResume } from "../lib/resumeProcessor"
import IResume from "../types/IResume"

export default function ResumePreview({ id }: { id: string }) {
    const iframeRef = useRef(null)

    const [scale, setScale] = useState(1)

    useEffect(() => {
        setScale(getScale())
    })

    function getScale() {
        const { offsetWidth: iframeWidth } = iframeRef.current as HTMLIFrameElement
        const documentWidth = 8.5 * 96
        // @ts-ignore
        const scaleX100 = parseInt(iframeWidth / documentWidth * 100) // parse until hundredths
        return scaleX100 / 100 // back to normal scale (0 to 1)
    }

    return (
        <>
            <iframe src={`/resumes/preview/${id}?scale=${scale}`} title="Preview" ref={iframeRef} ></iframe>
            {/* @ts-ignore */}
            <style jsx>{`
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            `}</style>
        </>
    )
}