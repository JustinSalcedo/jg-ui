import { Descendant } from "slate"
import IResume from "../types/IResume"

export const SITE_TITLE = "Job Gatherer"

export const DEFAULT_DRAFT: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }]

export const SAMPLE_RESUME: IResume = {
    "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    "basics": {
        "name": "Your Name",
        "label": "Your Position",
        "image": "",
        "email": "example@email.com",
        "phone": "(123) 456-7890",
        "url": "http://yourportfolio.example.com",
        "summary": "Write your career summary here. Talk about yourself, your main skills, and your most relevant highlights. You can end with a statement of your career objectives.",
        "location": {
        "address": "123 Anywhere St",
        "postalCode": "12345",
        "city": "Your City",
        "countryCode": "US",
        "region": "Province/State"
        },
        "profiles": [
            {
                "network": "LinkedIn",
                "username": "your-profile-345abc",
                "url": "https://linkedin.com/in/your-profile-345abc/"
            },
            {
                "network": "Twitter",
                "username": "youraccount",
                "url": "https://twitter.com/youraccount"
            }
        ]
    },
    "work": [
        {
        "name": "Company's name",
        "location": "City, State",
        "description": "A brief company description",
        "position": "Position/Role",
        "url": "http://yourcompany.example.com",
        "startDate": "2000-01-01",
        "endDate": "2001-01-02",
        "summary": "Write a short summary about your past or current company. Mention its sector, niche, flag products, and services",
        "highlights": [
                "Highlight your biggest achievements and responsibilities using your skills and qualities"
            ]
        }
    ],
    "education": [
        {
            "institution": "Your University or College",
            "url": "https://www.college.edu/",
            "area": "Major Area of Study",
            "studyType": "Study Type or Degree",
            "startDate": "2000-01-01",
            "endDate": "2001-01-02",
            "score": "4.0",
            "courses": [
                "Credit or non-credit courses"
            ]
        }
    ],
    "certificates": [
        {
            "name": "Certificate",
            "issuer": "Issuer organization",
            "date": "2000-03-05",
            "url": "https://certificate-url.com"
        }
    ],
    "skills": [
        {
            "name": "Skill",
            "level": "Master",
            "keywords": [
                "Related technologies",
                "languages",
                "tools"
            ]
        }
    ],
    "languages": [
        {
        "language": "English",
        "fluency": "Native speaker"
        }
    ],
    "references": [
        {
        "name": "Jhon Doe",
        "reference": "Quote your referral in a couple of sentences"
        }
    ],
    "projects": [
        {
        "name": "Project name",
        "description": "Describe what your project is or does",
        "highlights": [
            "Again, highlight your biggest challenges and solutions",
            "Talk about your involved soft and hard skills"
        ],
        "keywords": [
            "Tags", "Technologies", "Niches"
        ],
        "startDate": "2000-01-01",
        "endDate": "2001-01-02",
        "url": "https://project.domain.com",
        "roles": [
            "Job roles", "Specialities"
        ],
        "entity": "Project owner or entity",
        "type": "Project type"
        }
    ],
    "meta": {
        "canonical": "https://raw.githubusercontent.com/jsonresume/resume-schema/master/resume.json",
        "version": "v1.0.0",
        "lastModified": "2017-12-24T15:53:00"
    }
}