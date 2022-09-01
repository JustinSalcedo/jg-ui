import styles from './TextView.module.css';
import utilStyles from '../../styles/utils.module.css'

export default function TextView({ content, input, skills, resps }: {
    content:string, input?: string
    skills: string[], resps: string[]
}) {
    function highlightText () {
        let highlights = content
        if (input) {
            highlights = highlights.replace(input, `<ins>${input}</ins>`)
        }
        if (skills) {
            skills.forEach(skill => {
                if (skill !== 'ins') {
                    highlights = highlights.replace(skill, `<em>${skill}</em>`)
                }
            })
        }
        if (resps) {
            resps.forEach(resp => {
                if (resp !== 'ins' && resp !== 'span') {
                    highlights = highlights.replace(resp, `<span>${resp}</span>`)
                }
            })
        }
        return highlights
    }

    return (
        <>
            <div className={styles.view + ' ' + utilStyles['hide-scrollbar']} dangerouslySetInnerHTML={{__html: highlightText()}}></div>
        </>
    )
}