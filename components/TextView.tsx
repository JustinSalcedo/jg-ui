import styles from './TextView.module.css';

export default function TextView({ content }: { content:string }) {
    return (
        <div className={styles.view}>{content}</div>
    )
}