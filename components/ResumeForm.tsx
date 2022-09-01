import IResume, { IBasics, ICertificate, IEducationItem, ILocation, IProfile, IProject, ISkill, IWorkItem } from "../types/IResume"
import Form from "./common/Form/index"
import utilStyles from "../styles/utils.module.css"
import Lister from "./common/Lister/index"
import { SAMPLE_RESUME } from "../constants/index"
import { ChangeEvent, ChangeEventHandler, FocusEvent, HTMLInputTypeAttribute, useState } from "react"
import Input from "./common/Input/index"

const SAMPLE_SKILL = SAMPLE_RESUME.skills[0]
const SAMPLE_EDUCATION = SAMPLE_RESUME.education[0]
const SAMPLE_CERTIFICATE = SAMPLE_RESUME.certificates[0]
const SAMPLE_WORK = SAMPLE_RESUME.work[0]
const SAMPLE_PROJECT = SAMPLE_RESUME.projects[0]

interface InputProps {
    name: string, value: string, label?: string, type?: HTMLInputTypeAttribute | 'textarea'
    handler?: ChangeEventHandler<HTMLInputElement>, long?: boolean
}

interface Modifier {
    [key: string]: (field: string) => any
}

interface Fields {
    parsed: any, specials?: InputProps[]
}

type FieldHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => void

export default function ResumeForm({ resume, handleResume }: { resume: IResume, handleResume: (resume: IResume) => void }) {
    const { basics, skills, education, certificates, work, projects } = resume

    const [isFocused, setIsFocused] = useState(false)

    // General helpers
    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number, items: any[],
        handleItems: (items: any[]) => void, modifier?: Modifier) => {
        const { name, value } = e.target; const newItems = [...items]
        let parsedValue: any = value
        if (modifier && Object.keys(modifier).includes(name)) parsedValue = modifier[name](value)
        newItems[index] = { ...newItems[index], [name]: parsedValue }
        return handleItems(newItems)
    }

    const renderOneForm = ({ parsed, specials }: Fields, onFieldChange: ChangeEventHandler<HTMLInputElement>) => (
        <Form formData={parsed} formHandler={onFieldChange} registerFocus={setIsFocused}
            additionalInputs={specials ? specials.map(special => ( <Input {...special} key={special.name} /> )) : null} />
    )

    const renderForms = (fieldsList: Fields[], onFieldChange: FieldHandler ) => fieldsList
        .map(({ parsed, specials }, index) => (
            <Form key={index} formData={parsed} formHandler={e => onFieldChange(e, index)} registerFocus={setIsFocused}
                additionalInputs={specials ? specials.map(special => ( <Input {...special} key={special.name} /> )) : null}
            /> ))

    const addFieldHandler = (specials: InputProps[], onFieldChange: FieldHandler, index: number) => specials
        .map(special => ({ ...special, handler: (e) => onFieldChange(e, index) } as InputProps))
    
    
    // Basics
    const handleBasics = (e: ChangeEvent<HTMLInputElement>, modifier? : Modifier) => {
        const { name, value } = e.target; let parsedValue: any = value
        if (modifier && Object.keys(modifier).includes(name)) parsedValue = modifier[name](value)
        return handleResume({ ...resume, basics: { ...resume.basics, [name]: parsedValue } })
    }

    const parseBasics = ({ name, label }: IBasics) => ({ name, label })

    const getBasics = (): Fields => {
        const { email, phone, url, profiles, summary } = basics
        const specials: InputProps[] = [
            { name: 'email', value: email, type: 'email' },
            { name: 'phone', value: phone, type: 'tel' },
            { name: 'url', value: url, type: 'url' },
            { name: 'profiles', label: 'linkedin', value: (profiles && profiles[0] && profiles[0].url) ? profiles[0].url : '', type: 'url' },
            { name: 'summary', value: summary, type: 'textarea', long: true }
        ]
            .map(special => ({ ...special, handler: (e) => handleBasics(e, {
                profiles: (v: string): IProfile[] => [{ network: 'LinkedIn', url: v, username: v.replace('https://linkedin.com/in/', '').replaceAll('/', '') }]
            }) } as InputProps))
        return { parsed: parseBasics(basics), specials }
    }

    // Location

    const handleLocation = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        return handleResume({ ...resume, basics: { ...resume.basics, location: { ...resume.basics.location, [name]: value } } })
    }

    const parseLocation = ({ address, city, region }: ILocation) => ({ address, city, region })

    const getLocation = (): Fields => {
        const { postalCode } = basics.location
        const specials: InputProps[] = [
            { name: 'postalCode', label: 'postalCode (0-9 only)', value: postalCode, handler: handleLocation }
        ]
        return { parsed: parseLocation(basics.location), specials }
    }

    // Skills
    const handleSkills = (skills: ISkill[]) => handleResume({ ...resume, skills })

    const onSkillChange: FieldHandler = (e, index) => handleChange(
        e, index, skills, handleSkills, { keywords: (v: string) => v.split(', ') }
    )

    const parseSkill = ({ name, keywords }: ISkill) => ({ name, keywords: keywords.join(', ') })

    const getSkills = (): Fields[] => skills.map(skill => ({ parsed: parseSkill(skill) }))

    // Education
    const handleEducation = (education: IEducationItem[]) => handleResume({ ...resume, education })

    const onEducationChange: FieldHandler = (e, index) => handleChange(
        e, index, education, handleEducation, { courses: (v: string) => v.split('; ') }
    )

    const parseEducation = ({ studyType, area, specialization, institution, location }: IEducationItem) => ({
        studyType, area, specialization, institution, location
    })

    const getEducation = (): Fields[] => education.map((edu, index) => {
        const specials: InputProps[] = [
            { name: 'url', value: edu.url, type: 'url' },
            { name: 'courses', value: edu.courses ? edu.courses.join('; ') : '', long: true },
            { name: 'startDate', value: edu.startDate, type: 'date'},
            { name: 'endDate', value: edu.endDate, type: 'date'}
        ]
        return { parsed: parseEducation(edu), specials: addFieldHandler(specials, onEducationChange, index) }
    })

    // Certificates
    const handleCertificates = (certificates: ICertificate[]) => handleResume({ ...resume, certificates })

    const onCertificateChange: FieldHandler = (e, index) => handleChange(
        e, index, certificates, handleCertificates
    )

    const parseCertificate = ({ name, issuer }: ICertificate) => ({ name, issuer })

    const getCertificates = (): Fields[] => certificates.map((certificate, index) => {
        const specials: InputProps[] = [
            { name: 'date', value: certificate.date, type: 'date' },
            { name: 'url', value: certificate.url, type: 'url' }
        ]
        return { parsed: parseCertificate(certificate), specials: addFieldHandler(specials, onCertificateChange, index) }
    })

    // Work
    const handleWork = (work: IWorkItem[]) => handleResume({ ...resume, work })

    const onWorkChange: FieldHandler = (e, index) => handleChange(
        e, index, work, handleWork, { highlights: (v: string) => v.split('\n') }
    )

    const parseWork = ({ name, location, position }: IWorkItem) => ({ name, location, position })

    const getWork = (): Fields[] => work.map((workXp, index) => {
        const specials: InputProps[] = [
            { name: 'url', value: workXp.url, type: 'url' },
            { name: 'description', value: workXp.description, long: true },
            { name: 'startDate', value: workXp.startDate, type: 'date' },
            { name: 'endDate', value: workXp.endDate, type: 'date' },
            { name: 'highlights', value: workXp.highlights.join('\n'), type: 'textarea', long: true }
        ]
        return { parsed: parseWork(workXp), specials: addFieldHandler(specials, onWorkChange, index) }
    })

    // Projects
    const handleProjects = (projects: IProject[]) => handleResume({ ...resume, projects })

    const onProjectChange: FieldHandler = (e, index) => handleChange(
        e, index, projects, handleProjects, { keywords: (v: string) => v.split(', '), highlights: (v: string) => v.split('\n') }
    )

    const parseProject = ({ name, keywords, entity, type }: IProject) => ({ name, keywords: keywords.join(', '), entity, type })

    // Missing description, endDate, startDate, highlights, url
    const getProjects = (): Fields[] => projects.map((project, index) => {
        const specials: InputProps[] = [
            { name: 'description', value: project.description, long: true },
            { name: 'startDate', value: project.startDate, type: 'date' },
            { name: 'endDate', value: project.endDate, type: 'date' },
            { name: 'highlights', value: project.highlights.join('\n'), type: 'textarea', long: true },
            { name: 'url', value: project.url, type: 'url', long: true }
        ]
        return { parsed: parseProject(project), specials: addFieldHandler(specials, onProjectChange, index) }
    })

    return (
        <>
            <div className={"container" + ' ' + utilStyles['hide-scrollbar']}>
                {basics ? (<>
                    <h4>Basics</h4>
                    {renderOneForm(getBasics(), handleBasics)}
                    {renderOneForm(getLocation(), handleLocation)}
                </>) : ''}
                {skills ? (<>
                    <h4>Skills <span>(split keywords by ', ')</span></h4>
                    <Lister isFocused={isFocused} items={skills} handleItems={handleSkills} renderedItems={renderForms(getSkills(), onSkillChange)} />
                    <Creator emptyItem={SAMPLE_SKILL} items={skills} handleItems={handleSkills} />
                </>): ''}
                {education ? (<>
                    <h4>Education <span>(split courses by '; ')</span></h4>
                    <Lister collapsible collapseTagList={education.map(edu => edu.studyType + ', ' + edu.area)} isFocused={isFocused} items={education}
                        handleItems={handleEducation} renderedItems={renderForms(getEducation(), onEducationChange)} />
                    <Creator emptyItem={SAMPLE_EDUCATION} items={education} handleItems={handleEducation} />
                </>): ''}
                {certificates ? (<>
                    <h4>Certificates</h4>
                    <Lister isFocused={isFocused} items={certificates} handleItems={handleCertificates} renderedItems={renderForms(getCertificates(), onCertificateChange)} />
                    <Creator emptyItem={SAMPLE_CERTIFICATE} items={certificates} handleItems={handleCertificates} />
                </>): ''}
                {work ? (<>
                    <h4>Work</h4>
                    <Lister collapsible collapseTagList={work.map(w => w.position + ' @ ' + w.name)} isFocused={isFocused} items={work}
                        handleItems={handleWork} renderedItems={renderForms(getWork(), onWorkChange)} />
                    <Creator emptyItem={SAMPLE_WORK} items={work} handleItems={handleWork} />
                </>): ''}
                {projects ? (<>
                    <h4>Projects <span>(split keywords by ', ')</span></h4>
                    <Lister collapsible collapseTagList={projects.map(proj => proj.name)} isFocused={isFocused} items={projects} handleItems={handleProjects} renderedItems={renderForms(getProjects(), onProjectChange)} />
                    <Creator emptyItem={SAMPLE_PROJECT} items={projects} handleItems={handleProjects} />
                </>): ''}
                <br />
            </div>
            {/* @ts-ignore */}
            <style jsx>{`
                .container {
                    height: 100%;
                    overflow-y: scroll;
                }
                h4 {
                    margin: 1rem;
                    margin-bottom: .25rem;
                    border-bottom: 1px solid lightgray;
                }
                h4 span {
                    font-weight: normal;
                    font-size: .875rem;
                }
            `}</style>
        </>
    )
}

function Creator({ emptyItem, items, handleItems }: { emptyItem: any, items: any[], handleItems: (items: any[]) => void }) {
    function handleClick() {
        handleItems([...items, emptyItem])
    }
    
    return (
        <>
            <div onClick={handleClick}>+</div>
            {/* @ts-ignore */}
            <style jsx>{`
                div {
                    font-size: 0;
                    font-weight: bold;
                    color: white;
                    text-align: center;
                    width: 100%;
                    height: 4px;
                    background-color: #1a7ec0;
                    cursor: pointer;
                    transition: all 150ms ease-in-out;
                }
                div:hover {
                    height: 1rem;
                    font-size: 1rem;
                }
            `}</style>
        </>
    )
}