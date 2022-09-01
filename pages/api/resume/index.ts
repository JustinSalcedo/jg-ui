import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = new Client('server')
        if (req.method === 'POST') {
            const { userId, applicationId, resume: inputResume } = req.body
            const newResume = await client.createResume(userId, applicationId, inputResume)
            res.status(201).json(newResume)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}