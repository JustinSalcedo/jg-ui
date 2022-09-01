import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = new Client('server')
        if (req.method === 'GET') {
            const { userid: userId } = req.headers
            const applications = await client.getAllApplications(userId as string)
            res.status(200).json(applications)
        }
        if (req.method === 'POST') {
            const userId = req.body.userId as string
            delete req.body.userId
            const newApplication = await client.createApplication(userId, req.body)
            res.status(201).json(newApplication)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}