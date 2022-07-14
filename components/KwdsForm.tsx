import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import styles from './KwdsForm.module.css';
import utilStyles from '../styles/utils.module.css';
import KwdItem from './KwdItem';

export default function KwdsForm({ skills, resps, addKeyword, deleteKeyword }: {
    skills: string[], resps: string[]
    addKeyword: (key: string, term: string) => void
    deleteKeyword: (key: 'skills' | 'resps', id: string | number) => void
}) {
    const [key, setKey] = useState('skills')
    const [value, setValue] = useState('')
    const [viewSkills, setViewSkills] = useState(true)

    function handleToggle(e: ChangeEvent) {
        const { value, checked } = e.target as HTMLInputElement
        if (checked) {
            setKey(value)
        }
    }

    function handleChange(e: ChangeEvent) {
        const { value } = e.target as HTMLInputElement
        setValue(value)
    }

    function handleSubmission(e: FormEvent) {
        e.preventDefault()
        addKeyword(key, value)
        setValue('')
    }

    function toggleViews(e: MouseEvent) {
        e.preventDefault()
        setViewSkills(viewSkills => !viewSkills)
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmission}>
                <div className={styles.toggle}>
                    <label htmlFor="keywords">Skills</label>
                    <input className={styles.radio} onChange={handleToggle}
                        type="radio" name="keywords" value="skills" checked={key === "skills"} />
                    <input className={styles.radio} onChange={handleToggle}
                        type="radio" name="keywords" value="resps" checked={key === "resps"} />
                    <label htmlFor="keywords">Duties</label>
                </div>
                <div className={styles.prompt}>
                    <input type="text" value={value} onChange={handleChange} />
                    <input type="submit" value=">" />
                </div>
            </form>
            <div className={styles['list-area']}>
                <details open={viewSkills} className={styles.details}>
                    <summary className={utilStyles['mg-btm']} onClick={toggleViews} >Skills: {skills.length}</summary>
                    <ul className={styles.list}>
                        {skills.map((skill, index) => (
                            <KwdItem key={index} keyword={skill} type="skill" deleteHandler={() => deleteKeyword('skills', index)} />
                        ))}
                    </ul>
                </details>
                <details open={!viewSkills} className={styles.details}>
                    <summary className={utilStyles['mg-btm']} onClick={toggleViews} >Responsibilities: {resps.length}</summary>
                    <ul className={styles.list}>
                        {resps.map((resp, index) => (
                            <KwdItem key={index} keyword={resp} type="resp" deleteHandler={() => deleteKeyword('resps', index)} />
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    )
}