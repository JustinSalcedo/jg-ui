import { useState } from 'react';
import KwdItem from './KwdItem';
import styles from './MatchCounter.module.css';

export default function MatchCounter({ skills, resps, resume }: {
    skills: string[], resps: string[], resume: string
}) {

    function countMatches(list: string[]) {
        let count = 0
        for (let i = 0; i < list.length; i++) {
            if(resume.includes(list[i].toLowerCase())) {
                count++
            }
        }
        return count
    }

    return (
        <div className={styles.container}>
            <div className="">
                <h4>Skills: {countMatches(skills)}/{skills.length}</h4>
                <ul className={styles.list}>
                    {skills.map((skill, index) => (
                        <KwdItem
                            key={index} keyword={skill}
                            type={resume.includes(skill.toLowerCase()) ? 'checked' : 'skill'}
                        />
                    ))}
                </ul>
            </div>
            <div className="">
                <h4>Responsibilities: {countMatches(resps)}/{resps.length}</h4>
                <ul className={styles.list}>
                    {resps.map((resp, index) => (
                        <KwdItem
                            key={index} keyword={resp}
                            type={resume.includes(resp.toLowerCase()) ? 'checked' : 'resp'}
                        />
                    ))}
                </ul>
            </div>
            <div className="">
                <h5>Total: {countMatches([ ...skills, ...resps ])}/{skills.length + resps.length}</h5>
            </div>
            {/* @ts-ignore */}
            <style jsx>{`
                h4, h5 {
                    margin: 0;
                }

                h4 {
                    margin-bottom: .5rem
                }
            `}</style>
        </div>
    )
}