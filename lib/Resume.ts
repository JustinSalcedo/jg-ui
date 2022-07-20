import { IBasics, ICertificate, IEducationItem, IProject, ISkill, IWorkItem } from "../types/IResume"

export default class Resume {
    private defaultDate = "2000-01-01"
    private defaultBasics = {
        "name": "",
        "label": "",
        "image": "",
        "email": "",
        "phone": "",
        "url": "",
        "summary": "",
        "location": {
            "address": "",
            "postalCode": "",
            "city": "",
            "countryCode": "",
            "region": ""
        },
        "profiles": [
            {
                "network": "",
                "username": "",
                "url": ""
            }
        ]
    }
    private basics: IBasics
    private skill: ISkill = {
        "name": "",
        "level": "",
        "keywords": [
            ""
        ]
    }
    private education: IEducationItem = {
        "institution": "",
        "url": "",
        "area": "",
        "studyType": "",
        "startDate": this.defaultDate,
        "endDate": this.defaultDate,
        "score": "",
        "courses": [
            "",
        ]
    }
    private certificate: ICertificate = {
        "name": "",
        "date": this.defaultDate,
        "url": "",
        "issuer": ""
    }
    private work: IWorkItem = {
        "name": "",
        "location": "",
        "description": "",
        "position": "",
        "url": "",
        "startDate": this.defaultDate,
        "endDate": this.defaultDate,
        "summary": "",
        "highlights": [
            ""
        ]
    }
    private project: IProject = {
        "name": "",
        "description": "",
        "highlights": [
            ""
        ],
        "keywords": [
            ""
        ],
        "startDate": this.defaultDate,
        "endDate": this.defaultDate,
        "url": "",
        "roles": [
            ""
        ],
        "entity": "",
        "type": ""
    }

    constructor(placeholder?: boolean, basics?: IBasics) {
        if (placeholder) {
            this.skill = this.setPlaceholder(this.skill)
            this.education = this.setPlaceholder(this.education)
            this.certificate = this.setPlaceholder(this.certificate)
            this.work = this.setPlaceholder(this.work)
            this.project = this.setPlaceholder(this.project)
        }
        this.basics = basics || this.defaultBasics
    }

    public getBasics() {
        return this.basics
    }

    public getSkill() {
        return this.skill
    }

    public getEducation() {
        return this.education
    }

    public getCertificate() {
        return this.certificate
    }

    public getWork() {
        return this.work
    }

    public getProject() {
        return this.project
    }

    public getResume() {
        return {
            "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
            "basics": this.basics,
            "work": [this.work],
            "education": [this.education],
            "certificates": [this.certificate],
            "skills": [this.skill],
            "projects": [this.project],
            "meta": {
                "canonical": "https://raw.githubusercontent.com/jsonresume/resume-schema/master/resume.json",
                "version": "v1.0.0",
                "lastModified": "2017-12-24T15:53:00"
            }
            }
    }

    private setPlaceholder(obj: object, objKey?: string) {
        if (Array.isArray(obj)) {
            return obj.map(item => {
                if (typeof(item) === "object") {
                    return this.setPlaceholder(item)
                }
                if (typeof(item) === "string" && !item) {
                    return objKey || "sample_text"
                }
                return item
            })
        }

        const populated = {}
        Object.entries(obj).forEach(([key, value]) => {
            if (value && typeof(value) === "object") {
                if (Array.isArray(value)) {
                    populated[key] = this.setPlaceholder(value, key)
                } else populated[key] = this.setPlaceholder(value)
            }
            if (typeof(value) === "string" && !value) {
                populated[key] = key
            }
        })
        return populated
    }
}