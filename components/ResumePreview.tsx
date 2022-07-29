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
    const [height, setHeight] = useState(documentHeight)
    const [page, setPage] = useState(1)
    const [skillset, setSkillset] = useState(0)

    useEffect(() => {
        setPrintAction(printResume.bind(this))
        setScale(getScale())
    })

    function printResume() {
        const popWindow = window.open(`/resumes/preview/${id}?skillview=${skillset}&page=${page}`, 'PRINT', `height=${documentHeight},width=${documentWidth}`)

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

    function handlePage(_e: MouseEvent) {
        setPage(page => page === 1 ? 2 : 1)
    }

    function measureHeight() {
        const { contentDocument } = iframeRef.current as HTMLIFrameElement
        const { body } = contentDocument
        if (body) {
            setHeight(body.offsetHeight / scale)
        }
    }

    function swapSkillset() {
        setSkillset(set => (set + 1) % 3)
        console.log(skillset)
    }

    return (
        <>
            <iframe src={`/resumes/preview/${id}?scale=${scale}&page=${page}&skillview=${skillset}`} title="Preview" ref={iframeRef} ></iframe>
            <div>
                <span className="arrow" onClick={handlePage}>{page === 1 ?'↓' : '↑'}</span>
                <span className="swap" onClick={swapSkillset}>{skillset ? (skillset === 1 ? 'K' : 'S+K') : 'S'}</span>
                <span className="measure" onClick={measureHeight}>⟳</span>
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
                    line-height: .75;
                }
                .arrow, .measure, .swap {
                    background-color: white;
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}