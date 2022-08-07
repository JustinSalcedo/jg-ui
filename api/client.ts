import { IApplication, ISkillKwd, IUser } from "../types/index";
import IResume from "../types/IResume";

// export async function fn(): Promise<> {
//     try {
//         const response = await fetch('/api/', {
//             method: '',
//             headers: {   
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify()
//         })
//         const _ = await response.json()
//         if (response.status !== 200) {
//             const { message }: Error = _
//             throw new Error(message)
//         }
//         return _
//     } catch (error) {
//         throw error
//     }
// }

export async function loginUser(inputUser: IUser): Promise<IUser> {
    try {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {   
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputUser)
        })
        const user = await response.json()
        if (response.status !== 200) {
            const { message }: Error = user
            throw new Error(message)
        }
        return user
    } catch (error) {
        throw error
    }
}

export async function getApplication(userId: string, id: string): Promise<IApplication> {
    try {
        const response = await fetch('/api/application/' + id, {
            method: 'GET',
            headers: {   
                'Content-Type': 'application/json',
                userid: userId
            },
        })
        const application = await response.json()
        if (response.status !== 200) {
            const { message }: Error = application
            throw new Error(message)
        }
        return application
    } catch (error) {
        throw error
    }
}

export async function getAllApplications(userId: string): Promise<IApplication[]> {
    try {
        const response = await fetch('/api/application', {
            method: 'GET',
            headers: {   
                'Content-Type': 'application/json',
                userid: userId
            },
        })
        const applications = await response.json()
        if (response.status !== 200) {
            const { message }: Error = applications
            throw new Error(message)
        }
        return applications
    } catch (error) {
        throw error
    }
}

export async function createApplication(userId: string, inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch('/api/application', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, application: inputApplication })
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

export async function editApplication(userId: string, id: string, inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch('/api/application/' + id, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, application: inputApplication })
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

export async function addLists(userId: string, id: string, skills: ISkillKwd[], duties: string[]): Promise<IApplication> {
    try {
        const response = await fetch('/api/application/' + id + '/keywords', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, skills, duties })
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

export async function createResume(userId: string, applicationId: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch('/api/resume', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, applicationId, resume: inputResume})
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

export async function getResume(userId: string, applicationId: string, id: string): Promise<IResume> {
    try {
        const response = await fetch('/api/resume/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                userid: userId,
                applicationid: applicationId
            },
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

export async function editResume(userId: string, applicationId: string, id: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch('/api/resume/' + id, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, applicationId, resume: inputResume })
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