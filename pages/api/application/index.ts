import { NextApiRequest, NextApiResponse } from "next";
import { IApplication } from "../../../types/index";

export const API_URL = "http://localhost:3031/api/application"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const { userid: userId } = req.headers
            const applications = await getAllApplications(userId as string)
            res.status(200).json(applications)
        }
        if (req.method === 'POST') {
            const { userId, application: inputApplication } = req.body
            const newApplication = await createApplication(userId, inputApplication)
            res.status(201).json(newApplication)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}

async function getAllApplications(userId: string): Promise<IApplication> {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                userid: userId
            },
        })
        const applications = await response.json()
        if (response.status !== 200) {
            const { message }: Error = applications.errors
            throw new Error(message);
        }
        return applications
    } catch (error) {
        throw error
    }
}

async function createApplication(userId: string, inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...inputApplication, userId })
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