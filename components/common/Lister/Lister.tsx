import { DragEvent, DragEventHandler, FocusEventHandler, ReactNode, useState } from "react";
import styles from './Lister.module.css'

export default function Lister({ renderedItems, items, handleItems, isFocused, collapsible, collapseTagList }: {
    renderedItems: ReactNode[]
    items: any[], handleItems: (items: any[]) => void
    isFocused?: boolean, collapsible?: boolean, collapseTagList?: string[]
}) {
    const [dragging, setDragging] = useState(false)
    const [onDropZone, setOnDropZone] = useState(false)
    const [targetZone, setTargetZone] = useState('')
    const [draggedItem, setDraggedItem] = useState('')

    function dragOnDropZone(item: string, zone: string) {
        swapItems(parseInt(item), parseInt(targetZone))
        setTargetZone('')
    }

    function swapItems(currentIndex: number, targetIndex: number) {
        if (currentIndex === targetIndex || targetIndex - currentIndex === 1) return

        const item = items[currentIndex]
        let newItems = [...items]
        
        // Extract item and define newItems
        const last = items.length - 1
        if (currentIndex === 0) newItems.shift()
        if (currentIndex === last) newItems.pop()
        if (currentIndex !== 0 && currentIndex !== last) {
            newItems = [...newItems.slice(0, currentIndex), ...newItems.slice(currentIndex + 1)]
        }

        // Insert item
        if (targetIndex === 0) newItems.unshift(item)
        if (targetIndex === last) newItems.push(item)
        if (targetIndex !== 0 && targetIndex !== last) {
            newItems = [...newItems.slice(0, targetIndex), item, ...newItems.slice(targetIndex)]
        }

        handleItems(newItems)
    }

    function handleDragStart() {
        setDragging(true)
    }

    function handleDragEnd(_e: DragEvent, itemIdx: string) {
        if (targetZone) dragOnDropZone(itemIdx, targetZone)
        setDragging(false)
    }

    function handleDragEnter(e: DragEvent, targetZone: string) {
        setTargetZone(targetZone)
        // setOnDropZone(true)
    }

    function handleDragLeave() {
        // setOnDropZone(false)
    }

    return (
        <>
            {renderedItems.map((item, index, items) => (
                    <Dragger key={index} item={item} index={index} lastItem={index === items.length - 1}
                        handleDragStart={handleDragStart} handleDragEnd={handleDragEnd}
                        handleDragEnter={handleDragEnter} handleDragLeave={handleDragLeave}
                        dragging={dragging} disableDragging={isFocused} collapsible={collapsible} collapseTag={collapseTagList ? collapseTagList[index] : ''}
                    />
            ))}
        </>
    )
}

function Dragger({ item, index, lastItem, dragging, disableDragging, collapsible,
    handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, collapseTag }: {
    item: ReactNode, index: number, lastItem: boolean
    handleDragStart: DragEventHandler
    handleDragEnd: (e: DragEvent, itemIdx: string) => void
    handleDragEnter: (e: DragEvent, targetZone: string) => void
    handleDragLeave: DragEventHandler, collapseTag?: string
    dragging?: boolean, disableDragging?: boolean, collapsible?: boolean
}) {

    function onDragEnter(e: DragEvent) {
        const { innerText } = e.target as HTMLDivElement
        handleDragEnter(e, innerText)
    }

    function onDragEnd(e: DragEvent) {
        handleDragEnd(e, index.toString())
    }
    
    return (
        <>
            <div className={styles.gap + (dragging ? ' ' + styles.active : '')}
                onDragEnter={onDragEnter} onDragLeave={handleDragLeave}
            >{index}</div>
            {collapsible ? (
                <details open className={styles.collapse} draggable={!disableDragging} onDragStart={handleDragStart} onDragEnd={onDragEnd}>
                    <summary><div className={styles.tag}>{'-> ' + (collapseTag || index + 1)}</div></summary>
                    <span className={styles.item}>{item}</span>
                </details>
            ): (
                <span className={styles.item} draggable={!disableDragging} onDragStart={handleDragStart} onDragEnd={onDragEnd}>{item}</span>
            )}
            {lastItem ? (<div className={styles.gap + (dragging ? ' ' + styles.active : '')}
                onDragEnter={onDragEnter} onDragLeave={handleDragLeave} >{index + 1}</div>)
            : ( <hr /> )}
        </>
    )
}