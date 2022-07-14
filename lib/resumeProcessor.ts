// import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { uuid } from "uuidv4";
import IResume from "../types/IResume";

const resumePath = path.join(process.cwd(), 'resumes.json')

export function resumeToText({ basics, skills, work, education, projects }: Partial<IResume>) {
    let text = ''
    if (basics && basics.summary) {
        text = text + `Summary\n${basics.summary}\n\n`
    }
    if (skills) {
        text = text + 'Skills\n' + skills
            .map(skill => `\t[${skill.name}]: ${skill.keywords.join(', ')}\n`)
            .join('') + '\n'
    }
    if (work) {
        text = text + 'Work\n' + work
            .map(w => `\t[${w.name}, ${w.position}]: ${w.highlights.join('\n')}\n`)
            .join('') + '\n'
    }
    if (education) {
        text = text + 'Education\n' + education
            .map(edu => `\t[${edu.institution}, ${edu.studyType}, ${edu.area}]: ${edu.courses.join(', ')}\n`)
            .join('') + '\n'
    }
    if (projects) {
        text = text + 'Projects\n' + projects
            .map(project => `\t[${project.name}]: ${project.highlights.join('\n')}\n`)
            .join('') + '\n'
    }

    return text
}

export function textToResume(text: string, resume: IResume) {
    const segments = text.split('\n\n')
    segments.forEach(segment => {
        if(segment.startsWith('Summary\n')) {
            resume['basics']['summary'] = segment.replace('Summary\n', '')
        }
        if(segment.startsWith('Skills\n')) {
            const updatedSkills = segment.replace('Skills\n', '').split('\n').map(line => {
                // unT = untrimmed
                const [unTName, unTKeywords] = line.split(']: ')
                const keywords = unTKeywords ? unTKeywords.split(', ') : [""]
                return {
                    name: unTName.replace('\t[', ''),
                    keywords
                }
            })
            for (let i = 0; i < resume.skills.length; i++) {
                resume.skills[i] = { ...resume.skills[i], ...updatedSkills[i] }
            }
        }
        if(segment.startsWith('Work\n')) {
            const updatedWork = segment.replace('Work\n', '').split('\n').map(line => {
                // unTNameAndPos = untrimmed name and position, unTHighs = untrimmed highlights
                const [unTNameAndPos, unTHighs] = line.split(']: ')
                const [name, position] = unTNameAndPos.replace('\t[', '').split(', ')
                const highlights = unTHighs ? unTHighs.split('\n') : [""]
                return {
                    name, position, highlights
                }
            })
            for (let i = 0; i < resume.work.length; i++) {
                resume.work[i] = { ...resume.work[i], ...updatedWork[i] }
            }
        }
        if(segment.startsWith('Education\n')) {
            const updatedEducation = segment.replace('Education\n', '').split('\n').map(line => {
                // unTEduData = untrimmed education data (institution, studyType, area)
                const [unTEduData, unTCourses] = line.split(']: ')
                const [institution, studyType, area] = unTEduData.replace('\t[', '').split(', ')
                const courses = unTCourses ? unTCourses.split(', ') : [""]
                return {
                    institution, studyType, area, courses
                }
            })
            for (let i = 0; i < resume.education.length; i++) {
                resume.education[i] = { ...resume.education[i], ...updatedEducation[i] }
            }
        }
        if(segment.startsWith('Projects\n')) {
            const updatedProjects = segment.replace('Projects\n', '').split('\n').map(line => {
                const [unTName, unTHighs] = line.split(']: ')
                const highlights = unTHighs ? unTHighs.split('\n') : [""]
                return {
                    name: unTName.replace('\t[', ''),
                    highlights
                }
            })
            for (let i = 0; i < resume.projects.length; i++) {
                resume.projects[i] = { ...resume.projects[i], ...updatedProjects[i] }
            }
        }
    })

    return resume
}

// async function getResumesData(): Promise<IResume[]> {
//     const fileContents = readFileSync(resumePath, 'utf8')
//     let jsonString = fileContents ? fileContents : '[]'
//     const processedJson = JSON.parse(jsonString)
//     if (typeof(processedJson) !== "object") {
//         writeFileSync(resumePath, '[]')
//         return []
//     }
//     return processedJson
// }

// export async function createResume(resume: IResume) {
//     try {
//         const resumes = await getResumesData()
//         const verifiedResume = { ...resume, _id: uuid() }
//         writeFileSync(resumePath, JSON.stringify([ ...resumes, verifiedResume ]))
//         return verifiedResume
//     } catch (error) {
//         throw error
//     }
// }

// export async function updateResume(_id: string, resume: Partial<IResume>) {
//     try {
//         delete resume._id
//         const resumes = await getResumesData()
//         const updatedResumes = resumes.map(savedResume => {
//             if (savedResume._id === _id) return {...savedResume, ...resume}
//             return savedResume
//         })
//         writeFileSync(resumePath, JSON.stringify([ ...updatedResumes ]))
//     } catch (error) {
//         throw error
//     }
// }

// export async function getResume(_id: string) {
//     const resumes = await getResumesData()
//     return resumes.find(resume => resume._id === _id)
// }