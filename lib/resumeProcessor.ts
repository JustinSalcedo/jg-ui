import { IElement, IElementType } from "../types/index";
import IResume, { ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "../types/IResume";

const skill2Txt = (skill: ISkill) => `\t[${skill.name}${skill.level ? ', ' + skill.level : ''}]: ${skill.keywords.join(', ')}\n`
const work2Txt = (w: IWorkItem) => `\t[${w.name}, ${w.position}]@${w.location}(${w.startDate} - ${w.endDate}): ${w.highlights.join('\n')}${w.url ? '\n- URL: ' + w.url : ''}\n`
const edu2Txt = (edu: IEducationItem) => `\t[${edu.institution}, ${edu.studyType}, ${edu.area}${edu.specialization ? ', ' + edu.specialization : ''}]@${edu.location}#${edu.score}(${edu.startDate} - ${edu.endDate}): ${edu.courses.join(', ')}${edu.url ? '\n- URL: ' + edu.url : ''}\n`
const cert2Txt = (cert: ICertificate) => `\t[${cert.issuer}](${cert.date}): ${cert.name}${cert.url ? '\n- URL: ' + cert.url : ''}\n`
const proj2Txt = (project: IProject) => `\t[${project.name}, ${project.type}](${project.startDate} - ${project.endDate}): ${project.keywords ? '{' + project.keywords.join(', ') + '}\n' : ''}${project.highlights.join('\n')}${project.url ? '\n- URL: ' + project.url : ''}\n`

const TYPE_MAP: { [key: string]: { heading: string, writer: (type: IElement) => string, field: string } } = {
    skill: {
        heading: 'Skills\n',
        writer: skill2Txt,
        field: 'skills'
    },
    work: {
        heading: 'Work\n',
        writer: work2Txt,
        field: 'work'
    },
    education: {
        heading: 'Education\n',
        writer: edu2Txt,
        field: 'education'
    },
    cert: {
        heading: 'Certificates\n',
        writer: cert2Txt,
        field: 'certificates'
    },
    project: {
        heading: 'Projects\n',
        writer: proj2Txt,
        field: 'projects'
    }
}

export function resumeToText({ basics, skills, work, education, certificates, projects }: Partial<IResume>) {
    let text = ''
    if (basics && basics.summary) {
        text = text + `Summary\n${basics.label ? '[' + basics.label + ']\n' : ''}${basics.summary}\n\n`
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
    const segments = text.trim().split('\n\n')
    segments.forEach(segment => {
        if(segment.startsWith('Summary\n')) {
            const line = segment.replace('Summary\n', '')
            if (line.split('\n').length > 1) {
                const [unTLabel, summary] = line.split('\n')
                resume['basics']['summary'] = summary
                const label = (unTLabel.startsWith('[') && unTLabel.endsWith(']')) && unTLabel.slice(1, unTLabel.length - 1)
                if (label) resume['basics']['label'] = label
            } else {   
                resume['basics']['summary'] = line
            }
        }
        if(segment.startsWith('Skills\n')) {
            const updatedSkills = segment.replace('Skills\n', '').split('\n').map(line => {
                // unT = untrimmed
                const [unTNameAndLvl, unTKeywords] = line.split(']: ')
                const [name, level] = unTNameAndLvl.replace('\t[', '').split(', ')
                const keywords = unTKeywords ? unTKeywords.split(', ') : [""]
                const wrap = {}
                if (level) wrap['level'] = level
                return {
                    ...wrap, name, keywords
                }
            })
            resume.skills = mergeList(resume.skills, updatedSkills)
        }
        if(segment.startsWith('Work\n')) {
            const updatedWork = segment.replace('Work\n' + '\t', '').split('\n\t').map(line => {
                // unTNameAndPos = untrimmed name and position, unTHighs = untrimmed highlights
                const [unTData, unTHighs] = line.split('): ')
                const [unTNameAndPos, unTLocAndDates] = unTData.split(']@')
                const [name, position] = unTNameAndPos.replace('[', '').split(', ')
                const [location, unTDates] = unTLocAndDates.split('(')
                const [startDate, endDate] = unTDates.split(' - ')
                const highlights = unTHighs ? unTHighs.split('\n') : [""]
                const url = (highlights[highlights.length - 1].startsWith('- URL: ')) ? highlights.pop().replace('- URL: ', '') : ''
                const wrap = {}
                if (url) wrap['url'] = url
                return {
                    ...wrap,
                    name, position, location, startDate, endDate, highlights
                }
            })
            resume.work = mergeList(resume.work, updatedWork)
        }
        if(segment.startsWith('Education\n')) {
            const updatedEducation = segment.replace('Education\n' + '\t', '').split('\n\t').map(line => {
                // unTEduData = untrimmed education data (institution, studyType, area, specialization, location, score, dates)
                const [unTEduData, unTCoursesAndUrl] = line.split('): ')
                const [unTDegree, unTLocScoDates] = unTEduData.split(']@')
                const [institution, studyType, area, specialization] = unTDegree.replace('[', '').split(', ')
                const [unTScoreAndLoc, unTDates] = unTLocScoDates.split('(')
                const [startDate, endDate] = unTDates.split(' - ')
                const [location, score] = unTScoreAndLoc.split('#')
                const [unTCourses, unTUrl] = unTCoursesAndUrl.split('\n')
                const courses = unTCourses ? unTCourses.split(', ') : [""]
                const url = unTUrl && unTUrl.startsWith('- URL: ') ? unTUrl.replace('- URL: ', '') : ''
                const wrap = {}
                if (specialization) wrap['specialization'] = specialization
                if (location) wrap['location'] = location
                if (url) wrap['url'] = url
                return {
                    ...wrap,
                    institution, studyType, area, score, startDate, endDate, courses
                }
            })
            resume.education = mergeList(resume.education, updatedEducation)
        }
        if (segment.startsWith('Certificates\n')) {
            const updatedCertificates = segment.replace('Certificates\n' + '\t', '').split('\n\t').map(line => {
                const [unIssAndDate, unNameAndUrl] = line.split('): ')
                const [issuer, date] = unIssAndDate.replace('[', '').split('](')
                const [name, unTUrl] = unNameAndUrl.split('\n')
                const url = unTUrl && unTUrl.startsWith('- URL: ') ? unTUrl.replace('- URL: ', '') : ''
                const wrap = {}
                if (url) wrap['url'] = url
                return {
                    ...wrap,
                    issuer, date, name
                }
            })
            resume.certificates = mergeList(resume.certificates, updatedCertificates)
        }
        if(segment.startsWith('Projects\n')) {
            const updatedProjects = segment.replace('Projects\n' + '\t', '').split('\n\t').map(line => {
                // unTProjData = name, type, dates; unTDetails = keywords, highlights, url
                const [unTProjData, unTDetails] = line.split('): ')
                const [unTNameAndType, unTDates] = unTProjData.split('](')
                const [name, type] = unTNameAndType.replace('[', '').split(', ')
                const [startDate, endDate] = unTDates.split(' - ')
                const highlights = unTDetails ? unTDetails.split('\n') : [""]
                const keywords = (highlights[0].startsWith('{') && highlights[0].endsWith('}'))
                    ? highlights.shift().slice(1, -1).split(', ')
                    : null
                const url = highlights[highlights.length - 1].startsWith('- URL: ')
                    ? highlights.pop().replace('- URL: ', '') : ''
                const wrap = {}
                if (keywords) wrap['keywords'] = keywords
                if (url) wrap['url'] = url
                return {
                    ...wrap,
                    name, type, startDate, endDate, highlights
                }
            })
            resume.projects = mergeList(resume.projects, updatedProjects)
        }
    })
    cleanTextToResume(text, resume)
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

function cleanTextToResume(text: string, resume: IResume) {
    Object.values(TYPE_MAP).forEach(({ heading, field }) => {
        if (!text.includes(heading)) {
            resume[field] = []
        }
    })
}

function mergeList(target: IElement[], update: IElement[]) {
    if (!update.length) return update
    for (let i = 0; i < update.length; i++) {
        target[i] = { ...target[i], ...update[i] }
    }
    return target
}