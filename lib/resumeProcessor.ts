import { Descendant } from "slate";
import { CustomElement, IElement, IElementType } from "../types/index";
import IResume, { IBasics, ICertificate, IEducationItem, ILocation, IProject, ISkill, IWorkItem } from "../types/IResume";
import { fullMonthToDate, monthDayToDate } from "./formatDate";

const skill2Txt = (skill: ISkill) => `\t[${skill.name}${skill.level ? ', ' + skill.level : ''}]: ${skill.keywords.join(', ')}\n`
const work2Txt = (w: IWorkItem) => `\t[${w.name}, ${w.position}]@${w.location}(${w.startDate} - ${w.endDate}): ${w.highlights.join('\n')}${w.url ? '\n- URL: ' + w.url : ''}\n`
const edu2Txt = (edu: IEducationItem) => `\t[${edu.institution}, ${edu.studyType}, ${edu.area}${edu.specialization ? ', ' + edu.specialization : ''}]@${edu.location}#${edu.score}(${edu.startDate} - ${edu.endDate}): ${edu.courses ? edu.courses.join(', ') : ''}${edu.url ? '\n- URL: ' + edu.url : ''}\n`
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

export function draftToString(draft: Descendant[]) {
    return draft
        .map(({ children }: CustomElement) => children
            .map(({ text }) => text.toLocaleLowerCase()).join(''))
        .join('\n')
}

export function draftToResume(draft: Descendant[], oldResume?: IResume): IResume {
    // Alternative headings dictionary
    const HEADING_ALIAS = { 'portfolio': 'projects', 'work experience': 'work' }
    try {
        if (!(draft.length && (draft[0] as CustomElement).type === 'heading')) throw new Error('Invalid draft')
        let currentSegment = ''
        const segments: { [key: string]: string[] } = { basics: [], summary: [], skills: [], work: [], certificates: [], education: [], projects: [] }
        const plainDraft = draft.map((element: CustomElement) => element.children.map(({ text }) => text).join(''))
        for (let i = 0; i < plainDraft.length; i++) {
            const element = plainDraft[i]

            // Define segment
            if (i === 0) currentSegment = 'basics'
            else {
                const lowHeading = element.toLowerCase()
                if (Object.keys(segments).includes(lowHeading)) currentSegment = lowHeading
                if (Object.keys(HEADING_ALIAS).includes(lowHeading)) currentSegment = HEADING_ALIAS[lowHeading]
            }

            // Push to segment
            segments[currentSegment].push(element)
        }

        // Basics // uF* = unFormatted // op* = optional
        const [name, uFLabel] = segments.basics[0].split(', ')
        const label = uFLabel.replace(/[()]/g, '')

        const [phone, email, location] = segments.basics[1].split(' | ')
        const [uFRegionNCode, city, opAddress] = location.split(', ').reverse()
        let [region, opCode] = uFRegionNCode.split(' ')
        // By now, postal code only accepts numeric values
        // TODO: Postal code universal validator
        opCode = (opCode && parseInt(opCode)) ? parseInt(opCode).toString() : null

        let opLinkedin = segments.basics.find(element => element.startsWith('LinkedIn: '))
        opLinkedin = opLinkedin && opLinkedin.replace('LinkedIn: ', '')
        let opPortfolio = segments.basics.find(element => element.startsWith('Portfolio: '))
        opPortfolio = opPortfolio && opPortfolio.replace('Portfolio: ', '')

        // Summary
        segments.summary.shift()
        const summary = segments.summary.join('\n')

        // Skills
        const skills = segments.skills[1].split('; ').map(sentence => {
            const [uFName, uFKeywords] = sentence.split(') ')
            const name = uFName.replace('(', '')
            const keywords = uFKeywords.split(', ')
            return { name, keywords } as ISkill
        })

        // Education
        segments.education.shift()
        const education = splitSections(segments.education).map(section => {
            const [studyType, area, opSpecialization] = section[0].trim().split(', ')
            const [dates, instNLoc] = section[1].split(' | ')
            const [opEndDate, opStartDate] = dates.replace('In Progress', '').split(' - ').reverse()
            const [institution, opLocation] = instNLoc.replace(')', '').split(' (')
            const courses = section[2] ? section[2].replace('Relevant Coursework: ', '').split('; ') : null
            const item: IEducationItem = { studyType, area, institution, courses }
            addOptsToObject(item, {
                specialization: opSpecialization, endDate: fullMonthToDate(opEndDate), startDate: fullMonthToDate(opStartDate), location: opLocation
            } as IEducationItem)

            return item
        })

        // Certificates
        segments.certificates.shift()
        const certificates: ICertificate[] = []
        splitSections(segments.certificates).forEach(section => {
            // Coursework education
            if (section[1] && section[1].startsWith('Coursework: ')) {
                const [area, institution, opEndDate] = section[0].trim().split(', ')
                const courses = section[1].replace('Coursework: ', '').split('; ')
                const item: IEducationItem = { area, institution, courses }
                if (opEndDate) item.endDate = fullMonthToDate(opEndDate)
                education.push(item)
            } else { // Certificate
                section.forEach(element => {
                    const [name, issuer, opDate] = element.trim().split(', ')
                    const item: ICertificate = { name, issuer }
                    if (opDate) item.date = fullMonthToDate(opDate)
                    certificates.push(item)
                })
            }            
        })

        // Work
        segments.work.shift()
        const work = splitSections(segments.work).map(section => {
            const [positionNName, datesNLoc] = section.shift().trim().split(' | ')
            const [position, name] = positionNName.split(' at ')
            const [dates, opLocation] = datesNLoc.replace(')', '').split(' (')
            const [opEndDate, opStartDate] = dates.replace('Current', '').split(' - ').reverse()
            const highlights = section
            const item: IWorkItem = { position, name, highlights }
            addOptsToObject(item, { location: opLocation, endDate: monthDayToDate(opEndDate), startDate: monthDayToDate(opStartDate) } as IWorkItem)
            return item
        })

        // Projects
        segments.projects.shift()
        const projects = splitSections(segments.projects).map(section => {
            const [nameNEntity, opDates] = section.shift().trim().split(' | ')
            const [name, type] = nameNEntity.replace(')', '').split(' (')
            const [opStartDate, opEndDate] = opDates ? opDates.split('- ').map(date => date ? date.trim() : null) : [null, null]
            const descLine = section.find(element => element.startsWith('Description: '))
            const opDescription = descLine ? descLine.replace('Description: ', '') : null
            const techLine = section.find(element => element.startsWith('Technologies: '))
            const opKeywords = techLine ? techLine.replace('Technologies: ', '').split(', ') : null
            const urlLine = section.find(element => element.startsWith('URL: '))
            const opUrl = urlLine ? urlLine.replace('URL: ', '') : null
            const highlights = section.filter(el => {
                return !(el.startsWith('Description: ') || el.startsWith('Technologies: ') || el.startsWith('URL: '))
            })
            const item: IProject = { name, type, highlights }
            addOptsToObject(item, {
                startDate: monthDayToDate(opStartDate), endDate: monthDayToDate(opEndDate), description: opDescription,
                keywords: opKeywords, url: opUrl
            } as IProject)
            return item
        })

        const resume: IResume = {
            basics: { name, label, phone, email, summary, location: { city, region } },
            skills, education, certificates, work, projects
        }
        addOptsToObject(resume.basics.location, { address: opAddress, postalCode: opCode } as ILocation)
        if (opPortfolio) resume.basics.url = opPortfolio
        if (opLinkedin) resume.basics.profiles = [{ network: 'LinkedIn', url: opLinkedin,
            username: opLinkedin.replace('https://linkedin.com/in/', '').replaceAll('/', '') }]
        
        if (oldResume) {
            const mergedResume: IResume = { ...oldResume, ...resume,
                education: oldResume.education
                    ? oldResume.education.map((edu, i) => (resume.education[i] ? {...edu, ...resume.education[i]} : edu))
                    : resume.education,
                certificates: oldResume.certificates
                    ? oldResume.certificates.map((cert, i) => (resume.certificates[i] ? {...cert, ...resume.certificates[i]} : cert))
                    : resume.certificates,
                work: oldResume.work
                    ? oldResume.work.map((workXp, i) => (resume.work[i] ? {...workXp, ...resume.work[i]} : workXp))
                    : resume.work,
                projects: oldResume.projects
                    ? oldResume.projects.map((project, i) => (resume.projects[i] ? {...project, ...resume.projects[i]} : project))
                    : resume.projects
            }
            return mergedResume
        }
        return resume
    } catch (error) {
        throw error
    }
}

function splitSections(elements: string[]) {
    const sections: string[][]  = []; let j = 0
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        if (element) sections[j] = sections[j] ? [...sections[j], element] : [element] 
        else j++
    }
    return sections
}

function addOptsToObject(target: { [key: string]: any }, opts: { [key: string]: any }) {
    Object.entries(opts).forEach(([key, value]) => {
        if (value) target[key] = value
    })
}