import { ChangeEvent, Dispatch, FormEvent, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './KwdsForm.module.css';
import utilStyles from '../../styles/utils.module.css';
import KwdItem from '../KwdItem';

export default function KwdsForm({ value, setValue, skills, resps, addKeyword, deleteKeyword }: {
    value: string, setValue: Dispatch<SetStateAction<string>>
    skills: string[], resps: string[]
    addKeyword: (key: string, term: string) => void
    deleteKeyword: (key: 'skills' | 'resps', id: string | number) => void
}) {
    const ref = useRef(null)

    const [key, setKey] = useState('skills')
    const [viewSkills, setViewSkills] = useState(true)

    useEffect(() => {
        (ref.current as HTMLInputElement).focus()
    })

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
        if (value) {
            addKeyword(key, value)
            setValue('')
        }
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
                    <input type="text" value={value} onChange={handleChange} ref={ref} />
                    <input type="submit" value=">" />
                </div>
            </form>
            <div className={styles['list-area']}>
                <details open={viewSkills} className={styles.details}>
                    <summary className={utilStyles['mg-btm']} onClick={toggleViews} >Skills: {skills.length}</summary>
                    <ul className={styles.list + ' ' + utilStyles['hide-scrollbar']}>
                        {skills.map((skill, index) => (
                            <KwdItem key={index} keyword={skill} type="skill" deleteHandler={() => deleteKeyword('skills', index)} />
                        ))}
                    </ul>
                </details>
                <details open={!viewSkills} className={styles.details}>
                    <summary className={utilStyles['mg-btm']} onClick={toggleViews} >Responsibilities: {resps.length}</summary>
                    <ul className={styles.list + ' ' + utilStyles['hide-scrollbar']}>
                        {resps.map((resp, index) => (
                            <KwdItem key={index} keyword={resp} type="resp" deleteHandler={() => deleteKeyword('resps', index)} />
                        ))}
                    </ul>
                </details>
            </div>
        </div>
    )
}