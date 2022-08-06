import { Descendant } from "slate"
import { DEFAULT_DRAFT } from "../constants/index"

export default class Application {
    private isAuth: boolean

    constructor(isAuth?: boolean) {
        this.isAuth = isAuth || false
    }

    loadJobDescription() {
        try {
            if (this.isAuth) {
                return false
            } 
            return window.localStorage.getItem('description') || ''
        } catch (error) {
            throw error
        }
    }

    saveJobDescription(text: string) {
        try {
            if (this.isAuth) {
                return false
            }
            window.localStorage.setItem('description', text)
        } catch (error) {
            throw error
        }
    }

    loadKeywords(): { skills: string[], resps: string[] } {
        try {
            if (this.isAuth) {
                return { skills: [], resps: [] }
            } 
            const keywordsStr = window.localStorage.getItem('keywords')
            return keywordsStr ? JSON.parse(keywordsStr) : { skills: [], resps: [] }
        } catch (error) {
            throw error
        }
    }

    saveKeywords({ skills, resps }: { skills: string[], resps: string[] }) {
        try {
            if (this.isAuth) {
                return false
            }
            window.localStorage.setItem('keywords', JSON.stringify({ skills, resps }))
        } catch (error) {
            throw error
        }
    }

    loadDraft(): Descendant[] {
        try {
            if (this.isAuth) return
            const draftStr = window.localStorage.getItem('draft')
            return draftStr ? JSON.parse(draftStr) : DEFAULT_DRAFT
        } catch (error) {
            throw error
        }
    }

    saveDraft(draft: Descendant[]) {
        try {
            if (this.isAuth) return
            window.localStorage.setItem('draft', JSON.stringify(draft))
        } catch (error) {
            throw error
        }
    }

    loadStage() {
        try {
            return parseInt(window.localStorage.getItem('stage')) || 0
        } catch (error) {
            throw error
        }
    }

    saveStage(stageNumber: number) {
        try {
            window.localStorage.setItem('stage', stageNumber.toString(10))
        } catch (error) {
            throw error
        }
    }

    deleteLocalData() {
        window.localStorage.removeItem('description')
        window.localStorage.removeItem('keywords')
    }
}