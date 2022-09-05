import { Descendant } from "slate"
import { DEFAULT_DRAFT } from "../constants/index"
import { IApplication } from "../types/index"
import IResume from "../types/IResume"
import Client from "./Client"

export default class Application {
    private isAuth: boolean
    private defaultJobApp: Partial<IApplication> = {
        title: '',
        companyName: '',
        position: '',
        website: ''
    }

    constructor(isAuth?: boolean) {
        this.isAuth = isAuth || false
    }

    // Auth user methods

    public async sendApplication(userId: string, { title, companyName, position, website, jobDescription }: IApplication, applicationId?: string) {
        try {
            const client = new Client('router')
            this.saveJobApplication({ title, companyName, position, website })
            this.saveJobDescription(jobDescription)
            if (applicationId) return client.editApplication(userId, applicationId, { title, companyName, position, website, jobDescription })
            const applicationRecord = await client.createApplication(userId, { title, companyName, position, website, jobDescription })
            window.sessionStorage.setItem('applicationId', applicationRecord._id)
            return applicationRecord
        } catch (error) {
            throw error
        }
    }

    public getApplicationId() {
        return window.sessionStorage.getItem('applicationId')
    }

    public async fetchApplication(userId: string) {
        try {
            const client = new Client('router')
            return client.getApplication(userId, this.getApplicationId())
        } catch (error) {
            throw error
        }
    }

    public async sendKeywords(userId: string, applicationId: string, { skills, resps }: { skills: string[], resps: string[] }) {
        try {
            const client = new Client('router')
            this.saveKeywords({ skills, resps })
            await client.addLists(userId, applicationId, skills.map(skill => ({ keyword: skill })), resps)
        } catch (error) {
            throw error
        }
    }

    public async sendResume(userId: string, applicationId: string, resume: IResume, draft: Descendant[], resumeId?: string) {
        try {
            const client = new Client('router')
            this.saveDraft(draft)
            if (resumeId) return client.editResume(userId, applicationId, resumeId, resume)
            const resumeRecord = await client.createResume(userId, applicationId, resume)
            window.sessionStorage.setItem('resumeId', resumeRecord._id)
            return resumeRecord
        } catch (error) {
            throw error
        }
    }

    public getResumeId() {
        return window.sessionStorage.getItem('resumeId')
    }

    public async fetchResume(userId: string) {
        try {
            const client = new Client('router')
            return client.getResume(userId, this.getApplicationId(), this.getResumeId())
        } catch (error) {
            throw error
        }
    }

    public async fetchMasterResume(userId: string) {
        try {
            const client = new Client('router')
            return client.getMasterResume(userId)
        } catch (error) {
            throw error
        }
    }

    // General methods

    public loadJobApplication(): Partial<IApplication> {
        try {
            if (this.isAuth) {
                const jobAppStr = window.sessionStorage.getItem('application')
                return jobAppStr ? JSON.parse(jobAppStr) : this.defaultJobApp
            }
        } catch (error) {
            throw error
        }
    }

    public saveJobApplication({ title, companyName, position, website }: Partial<IApplication>) {
        try {
            if (this.isAuth) {
                window.sessionStorage.setItem('application', JSON.stringify({ title, companyName, position, website }))
            }
        } catch (error) {
            throw error
        }
    }

    public loadJobDescription() {
        try {
            if (this.isAuth) return window.sessionStorage.getItem('description') || ''
            return window.localStorage.getItem('description') || ''
        } catch (error) {
            throw error
        }
    }

    public saveJobDescription(text: string) {
        try {
            if (this.isAuth) return window.sessionStorage.setItem('description', text)
            window.localStorage.setItem('description', text)
        } catch (error) {
            throw error
        }
    }

    public loadKeywords(): { skills: string[], resps: string[] } {
        try {
            if (this.isAuth) {
                const keywordsStr = window.sessionStorage.getItem('keywords')
                return keywordsStr ? JSON.parse(keywordsStr) : { skills: [], resps: [] }
            }
            const keywordsStr = window.localStorage.getItem('keywords')
            return keywordsStr ? JSON.parse(keywordsStr) : { skills: [], resps: [] }
        } catch (error) {
            throw error
        }
    }

    public saveKeywords({ skills, resps }: { skills: string[], resps: string[] }) {
        try {
            if (this.isAuth) return window.sessionStorage.setItem('keywords', JSON.stringify({ skills, resps }))
            window.localStorage.setItem('keywords', JSON.stringify({ skills, resps }))
        } catch (error) {
            throw error
        }
    }

    public loadDraft(): Descendant[] {
        try {
            if (this.isAuth) {
                const draftStr = window.sessionStorage.getItem('draft')
                return draftStr ? JSON.parse(draftStr) : DEFAULT_DRAFT
            }
            const draftStr = window.localStorage.getItem('draft')
            return draftStr ? JSON.parse(draftStr) : DEFAULT_DRAFT
        } catch (error) {
            throw error
        }
    }

    public saveDraft(draft: Descendant[]) {
        try {
            if (this.isAuth) return window.sessionStorage.setItem('draft', JSON.stringify(draft))
            window.localStorage.setItem('draft', JSON.stringify(draft))
        } catch (error) {
            throw error
        }
    }

    public loadStage() {
        try {
            if (this.isAuth) return parseInt(window.sessionStorage.getItem('stage')) || 0
            return parseInt(window.localStorage.getItem('stage')) || 0
        } catch (error) {
            throw error
        }
    }

    public saveStage(stageNumber: number) {
        try {
            if (this.isAuth) return window.sessionStorage.setItem('stage', stageNumber.toString(10))
            window.localStorage.setItem('stage', stageNumber.toString(10))
        } catch (error) {
            throw error
        }
    }

    public deleteLocalData() {
        if (this.isAuth) {
            window.sessionStorage.removeItem('application')
            window.sessionStorage.removeItem('applicationId')
            window.sessionStorage.removeItem('resumeId')
            window.sessionStorage.removeItem('stage')
            window.sessionStorage.removeItem('description')
            window.sessionStorage.removeItem('keywords')
            window.sessionStorage.removeItem('draft')
            return
        }
        window.localStorage.removeItem('description')
        window.localStorage.removeItem('keywords')
        window.localStorage.removeItem('draft')
    }
}