import { NextApiRequest, NextApiResponse } from "next";
import { IApplication } from "../../../types/index";

export const API_URL = "http://localhost:3031/api/application"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { application: inputApplication } = req.body
            const newApplication = await createApplication(inputApplication)
            res.status(201).json(newApplication)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}

async function createApplication(inputApplication: IApplication): Promise<IApplication> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputApplication)
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