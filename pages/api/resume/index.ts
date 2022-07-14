import { NextApiRequest, NextApiResponse } from "next";
// import { createResume } from "../../../lib/resumeProcessor";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // const { resume: inputResume } = req.body
        // const newResume = await createResume(inputResume)
        // res.status(201).json(newResume)
    }
}