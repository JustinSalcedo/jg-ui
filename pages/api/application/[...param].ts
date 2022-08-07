import { NextApiRequest, NextApiResponse } from "next";
import { IApplication, ISkillKwd } from "../../../types/index";
import { API_URL } from "./index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { param } = req.query
        const [id, path] = param as string[]
        if (req.method === 'GET') {
            const { userid: userId } = req.headers
            const application = await getApplication(userId as string, id)
            res.status(200).json(application)
        }
        if (req.method === 'PATCH') {
            const { userId, application: inputApplication } = req.body
            const updatedApplication = await editApplication(userId, id, inputApplication)
            res.status(200).json(updatedApplication)
        }
        if (req.method === 'POST' && path && path === "keywords") {
            const { userId, skills, duties } = req.body
            const updatedApplication = await addLists(userId, id, skills, duties)
            res.status(201).json(updatedApplication)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}

async function getApplication(userId: string, id: string): Promise<IApplication> {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                userid: userId
            }
        })
        const application = await response.json()
        if (response.status !== 200) {
            const { message }: Error = application.errors
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}

async function editApplication(userId: string, id: string, inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...inputApplication, userId })
        })
        const application = await response.json()
        if (response.status !== 200) {
            const { message }: Error = application.errors
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}

async function addLists(userId: string, id: string, skills: ISkillKwd[], duties: string[]): Promise<IApplication> {
    try {
        const response = await fetch(`${API_URL}/${id}/keywords`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, skills, duties })
        })
        const application = await response.json()
        if (response.status !== 201) {
            const { message }: Error = application.errors
            throw new Error(message);
        }
        return application
    } catch (error) {
        throw error
    }
}