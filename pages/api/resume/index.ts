import { NextApiRequest, NextApiResponse } from "next";
import IResume from "../../../types/IResume";

export const API_URL = "http://localhost:3031/api/resume"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { userId, applicationId, resume: inputResume } = req.body
            const newResume = await createResume(userId, applicationId, inputResume)
            res.status(201).json(newResume)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}

async function createResume(userId: string, applicationId: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, applicationId, resume: inputResume})
        })
        const resume = await response.json()
        if (response.status !== 201) {
            const { message }: Error = resume.errors
            throw new Error(message);
        }
        return resume
    } catch (error) {
        throw error
    }
}