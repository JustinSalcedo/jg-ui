import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import Resume from "../lib/Resume";
import { elementToText } from "../lib/resumeProcessor";
import { IElement, IElementType } from "../types/index";
import { ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "../types/IResume";
import DraftForm from "./DraftForm";

export default function ResumeTxtArea({ text, handler, updateResume } : {
    text: string,
    handler: (e: ChangeEvent, newDraft?: string) => void
    updateResume: (type: IElementType, element: IElement) => void
}) {
    const resume = new Resume()
    const [skill, setSkill] = useState(resume.getSkill()) as [ISkill, Dispatch<SetStateAction<ISkill>>]
    const [education, setEducation] = useState(resume.getEducation()) as [IEducationItem, Dispatch<SetStateAction<IEducationItem>>]
    const [cert, setCert] = useState(resume.getCertificate()) as [ICertificate, Dispatch<SetStateAction<ICertificate>>]
    const [work, setWork] = useState(resume.getWork()) as [IWorkItem, Dispatch<SetStateAction<IWorkItem>>]
    const [project, setProject] = useState(resume.getProject()) as [IProject, Dispatch<SetStateAction<IProject>>]

    function handleElement(type: IElementType, data: IElement) {
        switch (type) {
            case "skill":
                return setSkill(skill => ({ ...skill, ...data }))
            case "education":
                return setEducation(edu => ({ ...edu, ...data }))
            case "cert":
                return setCert(cert => ({ ...cert, ...data }))
            case "work":
                return setWork(work => ({ ...work, ...data }))
            case "project":
                return setProject(proj => ({ ...proj, ...data }))
            default:
                break;
        }
    }

    function addElement(type: IElementType) {
        const wrap = { skill, education, cert, work, project }
        handler(null, elementToText(type, wrap[type], text))
        updateResume(type, wrap[type])
        resetElement(type)
    }

    function resetElement(type: IElementType) {
        const resume = new Resume()
        const wrap: { [key: string]: {
            stateHandler: Dispatch<SetStateAction<IElement>>
            defaultState: () => IElement
        } } = {
            skill: { stateHandler: setSkill, defaultState: () => resume.getSkill() },
            education: { stateHandler: setEducation, defaultState: () => resume.getEducation() },
            cert: { stateHandler: setCert, defaultState: () => resume.getCertificate() },
            work: { stateHandler: setWork, defaultState: () => resume.getWork() },
            project: { stateHandler: setProject, defaultState: () => resume.getProject() }
        }
        console.log(wrap[type].defaultState())
        return wrap[type].stateHandler(wrap[type].defaultState())
    }

    return (
        <div>
            <DraftForm
                elements={{ skill, education, cert, work, project }}
                handleElement={handleElement.bind(this)}
                addElement={addElement.bind(this)}
            />
            <textarea onChange={handler} value={text}></textarea>
            {/* @ts-ignore */}
            <style jsx>{`
                div {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                textarea {
                    width: 100%;
                    height: 100%;
                    padding: 1rem;
                    font-size: .75rem;
                    line-height: 1.5;
                    // border: none;
                }
            `}</style>
        </div>
    )
}