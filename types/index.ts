export type Stage = 'writeApplication' | 'captureKeywords' | 'writeResume' | 'formatResume'
export type ContainerView = 'home' | 'threePanel' | 'twoPanel'

export interface Application {
    title: string
    companyName: string
    position: string
    phone?: string
    email?: string
    mailAddress?: string,
    website: string,
    submissionDate?: Date,
    status?: 'pending' | 'rejected' | 'interviewed' | 'accepted'
    comments?: string
}