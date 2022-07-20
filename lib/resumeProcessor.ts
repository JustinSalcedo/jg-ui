import { IElement, IElementType } from "../types/index";
import IResume, { ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "../types/IResume";

const skill2Txt = (skill: ISkill) => `\t[${skill.name}]: ${skill.keywords.join(', ')}\n`
const work2Txt = (w: IWorkItem) => `\t[${w.name}, ${w.position}]: ${w.highlights.join('\n')}\n`
const edu2Txt = (edu: IEducationItem) => `\t[${edu.institution}, ${edu.studyType}, ${edu.area}]: ${edu.courses.join(', ')}\n`
const cert2Txt = (cert: ICertificate) => `\t[${cert.name}]: ${cert.issuer}\n`
const proj2Txt = (project: IProject) => `\t[${project.name}]: ${project.highlights.join('\n')}\n`

const TYPE_MAP: { [key: string]: { heading: string, writer: (type: IElement) => string } } = {
    skill: {
        heading: 'Skills\n',
        writer: skill2Txt
    },
    work: {
        heading: 'Work\n',
        writer: work2Txt
    },
    education: {
        heading: 'Education\n',
        writer: edu2Txt
    },
    cert: {
        heading: 'Certificates\n',
        writer: cert2Txt
    },
    project: {
        heading: 'Projects\n',
        writer: proj2Txt
    }
}

export function resumeToText({ basics, skills, work, education, certificates, projects }: Partial<IResume>) {
    let text = ''
    if (basics && basics.summary) {
        text = text + `Summary\n${basics.summary}\n\n`
    }
    if (skills) {
        text = text + 'Skills\n' + skills
            .map(skill2Txt)
            .join('') + '\n'
    }
    if (work) {
        text = text + 'Work\n' + work
            .map(work2Txt)
            .join('') + '\n'
    }
    if (education) {
        text = text + 'Education\n' + education
            .map(edu2Txt)
            .join('') + '\n'
    }
    if (certificates) {
        text = text + 'Certificates\n' + certificates
            .map(cert2Txt)
            .join('') + '\n'
    }
    if (projects) {
        text = text + 'Projects\n' + projects
            .map(proj2Txt)
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
            resume.skills = mergeList(resume.skills, updatedSkills)
        }
        if(segment.startsWith('Work\n')) {
            const updatedWork = segment.replace('Work\n' + '\t', '').split('\n\t').map(line => {
                // unTNameAndPos = untrimmed name and position, unTHighs = untrimmed highlights
                const [unTNameAndPos, unTHighs] = line.split(']: ')
                const [name, position] = unTNameAndPos.replace('[', '').split(', ')
                const highlights = unTHighs ? unTHighs.split('\n') : [""]
                return {
                    name, position, highlights
                }
            })
            resume.work = mergeList(resume.work, updatedWork)
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
            resume.education = mergeList(resume.education, updatedEducation)
        }
        if (segment.startsWith('Certificates\n')) {
            const updatedCertificates = segment.replace('Certificates\n', '').split('\n').map(line => {
                const [unTName, issuer] = line.split(']: ')
                return {
                    name: unTName.replace('\t[', ''),
                    issuer
                }
            })
            resume.certificates = mergeList(resume.certificates, updatedCertificates)
        }
        if(segment.startsWith('Projects\n')) {
            const updatedProjects = segment.replace('Projects\n' + '\t', '').split('\n').map(line => {
                const [unTName, unTHighs] = line.split(']: ')
                const highlights = unTHighs ? unTHighs.split('\n') : [""]
                return {
                    name: unTName.replace('[', ''),
                    highlights
                }
            })
            resume.projects = mergeList(resume.projects, updatedProjects)
        }
    })
    return resume
}

export function elementToText(type: IElementType, element: IElement, draft: string) {
    if (!draft.includes(TYPE_MAP[type].heading)) {
        return draft.trim() + '\n\n' + TYPE_MAP[type].heading + TYPE_MAP[type].writer(element) + '\n'
    }
    const segments = draft.split('\n\n')
    return segments.map(segment => {
        if(segment.startsWith(TYPE_MAP[type].heading)) {
            return segment + '\n' + TYPE_MAP[type].writer(element)
        }
        return segment + '\n'
    }).join('\n')
}

function mergeList(target: IElement[], update: IElement[]) {
    for (let i = 0; i < update.length; i++) {
        target[i] = { ...target[i], ...update[i] }
    }
    return target
}