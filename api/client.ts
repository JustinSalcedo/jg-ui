import { IApplication, ISkillKwd } from "../types/index";
import IResume from "../types/IResume";

export async function createApplication(inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch('/api/application', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ application: inputApplication })
        })
        const application = await response.json()
        if (response.status !== 201) {
            const { message }: Error = application
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}

export async function editApplication(id: string, inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch('/api/application/' + id, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ application: inputApplication })
        })
        const application = await response.json()
        if (response.status !== 200) {
            const { message }: Error = application
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}

export async function addLists(id: string, skills: ISkillKwd[], duties: string[]): Promise<IApplication> {
    try {
        const response = await fetch('/api/application/' + id + '/keywords', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills, duties })
        })
        const application = await response.json()
        if (response.status !== 201) {
            const { message }: Error = application
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}

export async function createResume(applicationId: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch('/api/resume', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ applicationId, resume: inputResume})
        })
        const resume = await response.json()
        if (response.status !== 201) {
            const { message }: Error = resume
            throw new Error(message);
        }
        return resume
    } catch (error) {
        throw error
    }
}

export async function getResume(id: string): Promise<IResume> {
    try {
        const response = await fetch('/api/resume/' + id)
        const resume = await response.json()
        if (response.status !== 200) {
            const { message }: Error = resume
            throw new Error(message);
        }
        return resume
    } catch (error) {
        throw error
    }
}

export async function editResume(id: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch('/api/resume/' + id, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resume: inputResume })
        })
        const resume = await response.json()
        if (response.status !== 200) {
            const { message }: Error = resume
            throw new Error(message);
        }
        return resume
    } catch (error) {
        throw error
    }
}