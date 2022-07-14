import { NextApiRequest, NextApiResponse } from "next";
// import { getResume, updateResume } from "../../../lib/resumeProcessor";

const API_URL = "http://127.0.0.1:3031/api"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id: _id } = req.query
    if(req.method === 'GET') {
        // const resume = await getResume(_id as string)
        // res.status(200).json(resume)
    } else if (req.method === 'PATCH') {
        // const { resume: inputResume } = req.body
        // const updatedResume = await updateResume(_id as string, inputResume)
        // res.status(200).json(updatedResume)
    }
}

// async function getResume(_id: string) {
//     try {
//         const response = fetch()
//     } catch (error) {
        
//     }
// }

// async function createApplication()