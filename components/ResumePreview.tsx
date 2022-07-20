import { MouseEvent, useEffect, useRef, useState } from "react"
import cn from 'classnames'
import styles from './ResumePreview.module.css';

export default function ResumePreview({ id, setPrintAction }: {
    id: string,
    setPrintAction: (callback: () => void) => void
}) {
    const iframeRef = useRef(null)
    const documentWidth = 8.5 * 96
    const documentHeight = 11 * 96

    const [scale, setScale] = useState(1)
    // const [height, setHeight] = useState(documentHeight)
    const [page, setPage] = useState(1)
    const [pageData, setPageData] = useState([null, { height: documentHeight }, { height: documentHeight }])

    useEffect(() => {
        setPrintAction(printResume.bind(this))
        setScale(getScale())
        setResizeListener()
    })

    function printResume() {
        const popWindow = window.open(`/resumes/preview/${id}`, 'PRINT', `height=${documentHeight},width=${documentWidth}`)

        popWindow.document.close()
        popWindow.focus()

        popWindow.print()
    }

    function getScale() {
        const { offsetWidth: iframeWidth } = iframeRef.current as HTMLIFrameElement
        // @ts-ignore
        const scaleX100 = parseInt(iframeWidth / documentWidth * 100) // parse until hundredths
        return scaleX100 / 100 // back to normal scale (0 to 1)
    }

    function setResizeListener() {
        const { contentDocument } = iframeRef.current as HTMLIFrameElement
        const { body } = contentDocument
        if (body) {
            setPageData(pages => pages.map((pageData, index) => {
                if (page === index) {
                    return { height: body.offsetHeight / scale }
                }
                return pageData
            }))
        }
    }

    function handlePage(_e: MouseEvent) {
        setPage(page => page === 1 ? 2 : 1)
    }

    const { height } = pageData[page]

    return (
        <>
            <iframe src={`/resumes/preview/${id}?scale=${scale}&page=${page}`} title="Preview" ref={iframeRef} onLoad={setResizeListener}></iframe>
            <div>
                <span className="arrow" onClick={handlePage}>{page === 1 ?'↓' : '↑'}</span>
                <span className={cn({
                    [styles.fitting]: height <= documentHeight,
                    [styles.warning]: height > documentHeight,
                    [styles.suggestion]: height < documentHeight / 1.33
                })}>{height <= documentHeight ? `${height < documentHeight / 1.33 ? 'Too short' : 'Fitting :)'}` : 'Overflow!'}</span>
            </div>
            {/* @ts-ignore */}
            <style jsx>{`
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                div {
                    display: flex;
                    justify-content: end;
                    position: relative;
                    bottom: 2.5rem;
                    font-size: .75rem;
                }
                span {
                    padding: .5rem;
                    border-radius: .5rem;
                    margin-right: .5rem;
                }
                .arrow {
                    background-color: white;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}