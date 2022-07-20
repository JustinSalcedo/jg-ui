import { ChangeEvent, Dispatch, FormEvent, HTMLInputTypeAttribute, SetStateAction, useState } from "react";
import { IElement, IElementType } from "../types/index";
import { ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "../types/IResume";
import Input from "./Input";

const ELEMENT_TYPES = [ 'skill', 'education', 'cert', 'work', 'project' ]

export default function DraftForm({ elements, handleElement, addElement }: {
    elements: { skill: ISkill, education: IEducationItem, cert: ICertificate, work: IWorkItem, project: IProject }
    handleElement: (type: IElementType, data: IElement) => void
    addElement: (type: IElementType) => void
}) {
    const [elementType, setElementType] = useState('skill') as [IElementType, Dispatch<SetStateAction<IElementType>>]
    const { skill, education, cert, work, project } = elements

    function handleSelect(e: ChangeEvent) {
        const { value } = e.target as HTMLSelectElement
        setElementType(value as IElementType)
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        console.log('Adding new element')
        addElement(elementType)
    }

    function handleChange(e: ChangeEvent) {
        const { name, value } = e.target as HTMLInputElement
        const listNames = ['keywords', 'courses', 'roles']

        if (listNames.includes(name)) {
            return handleElement(elementType, {
                [name]: value.split(', ')
            })
        }
        if (name === "highlights") {
            return handleElement(elementType, {
                [name]: value.split('  ')
            })
        }
        return handleElement(elementType, {
            [name]: value
        })
    }

    return (
        <details>
            <summary>Add elements</summary>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="element">Element type: </label>
                    <select name="element" value={elementType} onChange={handleSelect}>
                        {ELEMENT_TYPES.map((elType, index) => (
                            <option key={index} value={elType}>{capitalLetter(elType)}</option>
                        ))}
                    </select>
                </div>
                {elementType === "skill" && (<>
                    {Object.entries(skill).map(([key, value]: [key: string, value: string | string[]]) => (
                        <Input
                            key={key} handler={handleChange} name={key}
                            value={key === "keywords" ? (value as string[]).join(', ') : value as string} />
                    ))}
                </>)}
                {elementType === "education" && (<>
                    {Object.entries(education).map(([key, value]: [key: string, value: string | string[]]) => {
                        let type: HTMLInputTypeAttribute = "text"
                        if (key === "url") type = "url"
                        if (key === "startDate" || key === "endDate") type = "date"
                        if (key === "score") type = "number"
                        return (
                            <Input
                                key={key} handler={handleChange} name={key} type={type}
                                value={key === "courses" ? (value as string[]).join(', ') : value as string}
                            />
                        )
                    })}
                </>)}
                {elementType === "cert" && (<>
                    {Object.entries(cert).map(([key, value]: [key: string, value: string]) => (
                        <Input
                            key={key} handler={handleChange} name={key}
                            value={value} type={key === "date" || key === "url" ? key : "text"} />
                    ))}
                </>)}
                {elementType === "work" && (<>
                    {Object.entries(work).map(([key, value]: [key: string, value: string | string[]]) => {
                        let type: HTMLInputTypeAttribute = "text"
                        if (key === "url") type = "url"
                        if (key === "startDate" || key === "endDate") type = "date"
                        return (
                            <Input
                                key={key} handler={handleChange} name={key} type={type}
                                value={key === "highlights" ? (value as string[]).join('  ') : value as string}
                            />
                        )
                    })}
                </>)}
                {elementType === "project" && (<>
                    {Object.entries(project).map(([key, value]: [key: string, value: string | string[]]) => {
                        let type: HTMLInputTypeAttribute = "text"
                        let newValue = value
                        if (key === "url") type = "url"
                        if (key === "startDate" || key === "endDate") type = "date"
                        if (key === "highlights") newValue = (value as string[]).join('  ')
                        if (key === "keywords" || key === "roles") newValue = (value as string[]).join(', ')
                        return (
                            <Input
                                key={key} handler={handleChange} name={key} type={type}
                                value={newValue as string}
                            />
                        )
                    })}
                </>)}
                <input type="submit" value="" hidden={true} />
            </form>
            {/* @ts-ignore */}
            <style jsx>{`
                details {
                    padding: .5rem;
                    font-size: .75rem;
                }
                details[open] > summary {
                    padding-bottom: .5rem
                }
                form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: min-content;
                    column-gap: 1rem;
                    row-gap: .25rem;
                }
            `}</style>
        </details>
    )
}

function capitalLetter(word: string) {
    return word[0].toUpperCase() + word.slice(1)
}