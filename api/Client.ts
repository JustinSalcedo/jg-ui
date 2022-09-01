import { IApplication, ISkillKwd, IUser } from "../types/index";
import IResume from "../types/IResume";

// public async fn(): Promise<> {
//     try {
//         const response = await fetch(this.apiUrl + '', {
//             method: '',
//             headers: {   
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify()
//         })
//         const _ = await response.json()
//         if (response.status !== 200) {
//             const { message }: Error = this.getError(_)
//             throw new Error(message)
//         }
//         return _
//     } catch (error) {
//         throw error
//     }
// }

export default class Client {
    private host: 'server' | 'router'
    private serverUrl: string = 'http://localhost:3031/api/'
    private apiUrl: string

    constructor(host: 'server' | 'router') {
        this.host = host
        this.apiUrl = host === 'server' ? this.serverUrl : '/api/'
    }

    private getError(payload: { errors: any }) {
        return this.host === 'server' ? payload.errors : payload
    }

    // User

    public async loginUser(inputUser: IUser): Promise<IUser> {
        try {
            const response = await fetch(this.apiUrl + 'user/login', {
                method: 'POST',
                headers: {   
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputUser)
            })
            const user = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(user)
                throw new Error(message)
            }
            return user
        } catch (error) {
            throw error
        }
    }

    // Application

    public async getApplication(userId: string, id: string): Promise<IApplication> {
        try {
            const response = await fetch(this.apiUrl + 'application/' + id, {
                method: 'GET',
                headers: {   
                    'Content-Type': 'application/json',
                    userid: userId
                },
            })
            const application = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(application)
                throw new Error(message)
            }
            return application
        } catch (error) {
            throw error
        }
    }

    public async getAllApplications(userId: string): Promise<IApplication[]> {
        try {
            const response = await fetch(this.apiUrl + 'application', {
                method: 'GET',
                headers: {   
                    'Content-Type': 'application/json',
                    userid: userId
                },
            })
            const applications = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(applications)
                throw new Error(message)
            }
            return applications
        } catch (error) {
            throw error
        }
    }

    public async createApplication(userId: string, inputApplication: IApplication): Promise<IApplication> {
        try {
            const response = await fetch(this.apiUrl + 'application', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...inputApplication, userId })
            })
            const application = await response.json()
            if (response.status !== 201) {
                const { message }: Error = this.getError(application)
                throw new Error(message);
            }
            return application
        } catch (error) {
            throw error
        }
    }

    public async editApplication(userId: string, id: string, inputApplication: IApplication): Promise<IApplication> {
        try {
            const response = await fetch(this.apiUrl + 'application/' + id, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...inputApplication, userId })
            })
            const application = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(application)
                throw new Error(message);
            }
            return application
        } catch (error) {
            throw error
        }
    }

    public async addLists(userId: string, id: string, skills: ISkillKwd[], duties: string[]): Promise<IApplication> {
        try {
            const response = await fetch(this.apiUrl + 'application/' + id + '/keywords', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, skills, duties })
            })
            const application = await response.json()
            if (response.status !== 201) {
                const { message }: Error = this.getError(application)
                throw new Error(message);
            }
            return application
        } catch (error) {
            throw error
        }
    }

    // Resume

    public async createResume(userId: string, applicationId: string, inputResume: IResume): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, applicationId, resume: inputResume})
            })
            const resume = await response.json()
            if (response.status !== 201) {
                const { message }: Error = this.getError(resume)
                throw new Error(message);
            }
            return resume
        } catch (error) {
            throw error
        }
    }

    public async getResume(userId: string, applicationId: string, id: string): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userid: userId,
                    applicationid: applicationId
                },
            })
            const resume = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(resume)
                throw new Error(message);
            }
            return resume
        } catch (error) {
            throw error
        }
    }

    public async editResume(userId: string, applicationId: string, id: string, inputResume: IResume): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume/' + id, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, applicationId, resume: inputResume })
            })
            const resume = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(resume)
                throw new Error(message);
            }
            return resume
        } catch (error) {
            throw error
        }
    }

    public async createMasterResume(userId: string, resume: IResume): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume/master', {
                method: 'POST',
                headers: {   
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, resume })
            })
            const masterResume = await response.json()
            if (response.status !== 201) {
                const { message }: Error = this.getError(masterResume)
                throw new Error(message)
            }
            return masterResume
        } catch (error) {
            throw error
        }
    }

    public async getMasterResume(userId: string): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume/master', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    userid: userId
                }
            })
            const masterResume = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(masterResume)
                throw new Error(message)
            }
            return masterResume
        } catch (error) {
            throw error
        }
    }

    public async editMasterResume(userId: string, resume: IResume): Promise<IResume> {
        try {
            const response = await fetch(this.apiUrl + 'resume/master', {
                method: 'PATCH',
                headers: {   
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, resume })
            })
            const masterResume = await response.json()
            if (response.status !== 200) {
                const { message }: Error = this.getError(masterResume)
                throw new Error(message)
            }
            return masterResume
        } catch (error) {
            throw error
        }
    }
}