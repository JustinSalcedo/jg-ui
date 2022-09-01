import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = new Client('server')
        const { param } = req.query
        const [id, path] = param as string[]
        if (req.method === 'GET') {
            const { userid: userId } = req.headers
            const application = await client.getApplication(userId as string, id)
            res.status(200).json(application)
        }
        if (req.method === 'PATCH') {
            const userId = req.body.userId as string
            delete req.body.userId
            const updatedApplication = await client.editApplication(userId, id, req.body)
            res.status(200).json(updatedApplication)
        }
        if (req.method === 'POST' && path && path === "keywords") {
            const { userId, skills, duties } = req.body
            const updatedApplication = await client.addLists(userId, id, skills, duties)
            res.status(201).json(updatedApplication)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}