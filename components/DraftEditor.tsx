import { Descendant } from "slate";
import RichTextEditor from "./common/RichTextEditor/RichTextEditor";
import IResume from "../types/IResume";
import { CustomElement } from "../types/IEditor";
import { dateToFullMonth, dateToMonthDay } from "../lib/formatDate";
import { UIEvent, useEffect, useState } from "react";
import { DEFAULT_DRAFT } from "../constants/index";

export default function DraftEditor({ resume, draft, handleDraft, readOnly }: {
    resume?: IResume, draft: Descendant[], handleDraft: (draft: Descendant[]) => void, readOnly?: boolean
}) {
    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        loadDraft()
    }, [resume, draft.length])
    
    function loadDraft() {
        if (!draft.length) {
            if (resume) handleDraft(resumeToDraft(resume))
            else handleDraft(DEFAULT_DRAFT)
        }
    }

    function handleScroll(e: UIEvent<HTMLDivElement>) {
        const { scrollTop } = e.currentTarget
        setScrollTop(scrollTop)
    }

    return (
        <>
            {draft.length ? (
                <RichTextEditor
                    content={draft} handler={handleDraft} readOnly={readOnly}
                    scrollTop={scrollTop} handleScroll={handleScroll}
                 />
            ): ''}
        </>
    )
}

// New Resume Processor

function resumeToDraft({ basics, skills, education, certificates, work, projects }: Partial<IResume>) {
    const { name, label, phone, email, location, profiles, url, summary } = basics
    const coursework = education ? education.filter(edu => edu.studyType === 'Coursework') : []
    
    const draftNodes: Descendant[] = []
    // cEl: common Element
    const cEl: CustomElement = { type: 'paragraph', children:[]}

    // Header with basics
    const heading: CustomElement = { type: 'heading', level: 1, children: [
        { text: name + ',', bold: true }, { text: ` (${label})` }
    ] }
    const info: CustomElement = { ...cEl, children: [
        { text: `${phone} | ${email} | ${location.address ? location.address + ', ' : ''}${location.city}, ${location.region} ${location.postalCode || ''}` }
    ] }
    const linkedin: CustomElement = { ...cEl, children: [
        { text: 'LinkedIn: ' + ((profiles && profiles[0]) ? profiles[0].url : '') }
    ] }
    const portfolioUrl: CustomElement = { ...cEl, children: [
        { text: 'Portfolio: ' + url }
    ] }

    // Summary
    const summaryHeading: CustomElement = { ...cEl, children: [
        { text: 'Summary', bold: true }
    ], align: 'center' }
    const summaryText: CustomElement = { ...cEl, children: [
        { text: summary }
    ] }

    draftNodes.push(heading, info, linkedin, portfolioUrl, summaryHeading, summaryText)

    if (skills) {
        draftNodes.push({ ...cEl, children: [{ text: 'Skills', bold: true }], align: 'center' })
        const skillStrings = skills.map(({ name, keywords }) => `(${name}) ${keywords.join(', ')}`)
        draftNodes.push({ ...cEl, children: [{ text: skillStrings.join('; ') }] })
    }
    if (education) {
        draftNodes.push({ ...cEl, children: [{ text: 'Education', bold: true }], align: 'center' })
        education.filter(edu => edu.studyType !== 'Coursework').forEach((edu, idx) => {
            const eduTitle: CustomElement = { ...cEl, children: [
                { text: '\t' + edu.studyType + ', ' },
                { text: edu.area, underline: true },
                { text: edu.specialization ? ', ' + edu.specialization : '' }
            ] }
            const eduDetails: CustomElement = { ...cEl, children: [
                { text: `${edu.startDate ? dateToFullMonth(edu.startDate) + ' - ' : ''}${edu.endDate ? dateToFullMonth(edu.endDate) : 'In Progress'} | ` },
                { text: edu.institution, underline: true },
                { text: edu.location ? ` (${edu.location})` : '' }
            ] }
            const eduCourses: CustomElement = edu.courses ? { ...cEl, children: [
                { text: 'Relevant Coursework: ' + edu.courses.join('; ') }
            ] } : null
            draftNodes.push(eduTitle, eduDetails)
            if (eduCourses) draftNodes.push(eduCourses)
            if (idx !== education.length - 1) {
                draftNodes.push({ ...cEl, children: [{ text: '' }] })
            }
        })
    }
    if (certificates && certificates.length || coursework.length) {
        draftNodes.push({ ...cEl, children: [{ text: 'Certificates', bold: true }], align: 'center' })
        certificates.forEach(cert => {
            const certTitle: CustomElement = { ...cEl, children: [
                { text: '\t' }, { text: cert.name, underline: true },
                { text: ', ' + cert.issuer },
                { text: cert.date ? ', ' + dateToFullMonth(cert.date) : '' }
            ] }
            draftNodes.push(certTitle)
        })
        if (certificates.length && coursework.length) {
            draftNodes.push({ ...cEl, children: [{ text: '' }] })
        }
        coursework.forEach((edu, idx) => {
            const courseTitle: CustomElement = { ...cEl, children: [
                { text: '\t' }, { text: edu.area, underline: true },
                { text: ', ' + edu.institution },
                { text: edu.endDate ? ', ' + dateToFullMonth(edu.endDate) : '' }
            ] }
            const courseCourses: CustomElement = { ...cEl, children: [
                { text: 'Coursework: ' + edu.courses.join('; ') }
            ] }
            draftNodes.push(courseTitle, courseCourses)
            if (idx !== coursework.length - 1) {
                draftNodes.push({ ...cEl, children: [{ text: '' }] })
            }
        })
    }
    if (work) {
        draftNodes.push({ ...cEl, children: [{ text: 'Work experience', bold: true }], align: 'center' })
        work.forEach((w, idx) => {
            const workTitle: CustomElement = { ...cEl, children: [
                { text: '\t' }, { text: w.position, underline: true },
                { text: ' at ' + w.name + ' | ' + (w.startDate ? dateToMonthDay(w.startDate)
                    + ' - ' : '') + (w.endDate ? dateToMonthDay(w.endDate) : 'Current')
                    + (w.location ? ` (${w.location})` : '') }
            ] }
            const workHighlights: CustomElement[] = w.highlights.map(highlight => ({
                ...cEl,
                children: [{ text: highlight }]
            }))
            draftNodes.push(workTitle, ...workHighlights)
            if (idx !== work.length - 1) {
                draftNodes.push({ ...cEl, children: [{ text: '' }] })
            }
        })
    }
    if (projects) {
        draftNodes.push({ ...cEl, children: [{ text: 'Portfolio', bold: true }], align: 'center' })
        projects.forEach((proj, idx) => {
            const projTitle: CustomElement = { ...cEl, children: [
                { text: '\t' }, { text: proj.name, underline: true },
                { text: ` (${proj.type})` + (proj.startDate && proj.endDate ? ' | ' : '')
                    + (proj.startDate ? dateToMonthDay(proj.startDate) + ' ' : '')
                    + (proj.endDate ? '- ' + dateToMonthDay(proj.endDate) : '' ) }
            ] }
            const projDesc: CustomElement = { ...cEl, children: [
                { text: 'Description: ' + proj.description }
            ] }
            const projHighlights: CustomElement[] = proj.highlights.map(highlight => ({
                ...cEl,
                children: [{ text: highlight }]
            }))
            const projTech: CustomElement = { ...cEl, children: [
                { text: 'Technologies: ' + proj.keywords.join(', ') }
            ] }
            const projUrl: CustomElement = { ...cEl, children: [
                { text: 'URL: ' + proj.url }
            ] }
            draftNodes.push(projTitle, projDesc, ...projHighlights, projTech, projUrl)
            if (idx !== projects.length - 1) {
                draftNodes.push({ ...cEl, children: [{ text: '' }] })
            }
        })
    }
    return draftNodes
}