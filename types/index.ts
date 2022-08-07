import { ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "./IResume"

export type Stage = 'writeApplication' | 'captureKeywords' | 'writeResume' | 'formatResume'
export type ContainerView = 'home' | 'threePanel' | 'twoPanel'

export type IElement = ICertificate | IEducationItem | IProject | ISkill | IWorkItem
export type IElementType = 'skill' | 'education' | 'cert' | 'work' | 'project'

export type ISkillKwd = {
    n?: number
    keyword: string
}

export interface IApplication {
    _id?: string
    // Required data
    title: string
    companyName: string
    position: string
    website: string
    jobDescription: string
    // Additional data
    phone?: string
    email?: string
    mailAddress?: string,
    submissionDate?: Date,
    status?: 'pending' | 'rejected' | 'interviewed' | 'accepted'
    comments?: string
    // Keyword lists
    skillKeywords?: ISkillKwd[]
    responsibilities?: string[]

    resume?: string

    createdAt?: Date
    updatedAt?: Date
    __v?: number
}

export type { CustomEditor, CustomElement, CustomText } from './IEditor'

export interface IUser {
    _id?: string
    sub: string
    name: string
    email: string
    email_verified: boolean
    masterResume?: string
    applications?: string[]
    createdAt?: Date
    updatedAt?: Date
}