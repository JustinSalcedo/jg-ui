import styles from './KwdItem.module.css'
import cn from 'classnames'

export default function KwdItem({ keyword, type, deleteHandler }: {
    keyword: string,
    type: 'skill' | 'resp' | 'checked'
    deleteHandler?: () => void
}) {
    return (
        <li className={`${styles.item} ${cn({
            [styles.skill]: type === "skill",
            [styles.resp]: type === "resp",
            [styles.checked]: type === "checked"
        })}`}>
            {keyword}
            {deleteHandler && (
                <span onClick={deleteHandler} className={styles.cross} >x</span>
            )}
        </li>
    )
}