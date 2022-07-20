/* tslint:disable */

/**
 * e.g. 2014-06-29
 */
export type Iso8601 = string;

export interface IBasics {
  name?: string;
  /**
   * e.g. Web Developer
   */
  label?: string;
  /**
   * URL (as per RFC 3986) to a image in JPEG or PNG format
   */
  image?: string;
  /**
   * e.g. thomas@gmail.com
   */
  email?: string;
  /**
   * Phone numbers are stored as strings so use any format you like, e.g. 712-117-2923
   */
  phone?: string;
  /**
   * URL (as per RFC 3986) to your website, e.g. personal homepage
   */
  url?: string;
  /**
   * Write a short 2-3 sentence biography about yourself
   */
  summary?: string;
  location?: {
    /**
     * To add multiple address lines, use
     * . For example, 1234 Glücklichkeit Straße
     * Hinterhaus 5. Etage li.
     */
    address?: string;
    postalCode?: string;
    city?: string;
    /**
     * code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN
     */
    countryCode?: string;
    /**
     * The general region where you live. Can be a US state, or a province, for instance.
     */
    region?: string;
    [k: string]: unknown;
  };
  /**
   * Specify any number of social networks that you participate in
   */
  profiles?: {
    /**
     * e.g. Facebook or Twitter
     */
    network?: string;
    /**
     * e.g. neutralthoughts
     */
    username?: string;
    /**
     * e.g. http://twitter.example.com/neutralthoughts
     */
    url?: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

export interface IWorkItem {
  /**
   * e.g. Facebook
   */
  name?: string;
  /**
   * e.g. Menlo Park, CA
   */
  location?: string;
  /**
   * e.g. Social Media Company
   */
  description?: string;
  /**
   * e.g. Software Engineer
   */
  position?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * Give an overview of your responsibilities at the company
   */
  summary?: string;
  /**
   * Specify multiple accomplishments
   */
  highlights?: string[];
  [k: string]: unknown;
}

export interface IVolunteerItem {
  /**
   * e.g. Facebook
   */
  organization?: string;
  /**
   * e.g. Software Engineer
   */
  position?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * Give an overview of your responsibilities at the company
   */
  summary?: string;
  /**
   * Specify accomplishments and achievements
   */
  highlights?: string[];
  [k: string]: unknown;
}

export interface IEducationItem {
  /**
   * e.g. Massachusetts Institute of Technology
   */
  institution?: string;
  location?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  /**
   * e.g. Arts
   */
  specialization?: string,
  area?: string;
  /**
   * e.g. Bachelor
   */
  studyType?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * grade point average, e.g. 3.67/4.0
   */
  score?: string;
  /**
   * List notable courses/subjects
   */
  courses?: string[];
  [k: string]: unknown;
}

export interface ICertificate {
  /**
   * e.g. Certified Kubernetes Administrator
   */
  name?: string;
  /**
   * e.g. 1989-06-12
   */
  date?: string;
  /**
   * e.g. http://example.com
   */
  url?: string;
  /**
   * e.g. CNCF
   */
  issuer?: string;
  [k: string]: unknown;
}
export interface IAward {
  /**
   * e.g. One of the 100 greatest minds of the century
   */
  title?: string;
  date?: Iso8601;
  /**
   * e.g. Time Magazine
   */
  awarder?: string;
  /**
   * e.g. Received for my work with Quantum Physics
   */
  summary?: string;
  [k: string]: unknown;
}

export interface IPublication {
  /**
   * e.g. The World Wide Web
   */
  name?: string;
  /**
   * e.g. IEEE, Computer Magazine
   */
  publisher?: string;
  releaseDate?: Iso8601;
  /**
   * e.g. http://www.computer.org.example.com/csdl/mags/co/1996/10/rx069-abs.html
   */
  url?: string;
  /**
   * Short summary of publication. e.g. Discussion of the World Wide Web, HTTP, HTML.
   */
  summary?: string;
  [k: string]: unknown;
}

export interface ISkill {
  /**
   * e.g. Web Development
   */
  name?: string;
  /**
   * e.g. Master
   */
  level?: string;
  /**
   * List some keywords pertaining to this skill
   */
  keywords?: string[];
  [k: string]: unknown;
}

export interface ILanguage {
  /**
   * e.g. English, Spanish
   */
  language?: string;
  /**
   * e.g. Fluent, Beginner
   */
  fluency?: string;
  [k: string]: unknown;
}

export interface IInterest {
  /**
   * e.g. Philosophy
   */
  name?: string;
  keywords?: string[];
  [k: string]: unknown;
}

export interface IReference {
  /**
   * e.g. Timothy Cook
   */
  name?: string;
  /**
   * e.g. Joe blogs was a great employee, who turned up to work at least once a week. He exceeded my expectations when it came to doing nothing.
   */
  reference?: string;
  [k: string]: unknown;
}

export interface IProject {
  /**
   * e.g. The World Wide Web
   */
  name?: string;
  /**
   * Short summary of project. e.g. Collated works of 2017.
   */
  description?: string;
  /**
   * Specify multiple features
   */
  highlights?: string[];
  /**
   * Specify special elements involved
   */
  keywords?: string[];
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * e.g. http://www.computer.org/csdl/mags/co/1996/10/rx069-abs.html
   */
  url?: string;
  /**
   * Specify your role on this project or in company
   */
  roles?: string[];
  /**
   * Specify the relevant company/entity affiliations e.g. 'greenpeace', 'corporationXYZ'
   */
  entity?: string;
  /**
   *  e.g. 'volunteering', 'presentation', 'talk', 'application', 'conference'
   */
  type?: string;
  [k: string]: unknown;
}

 export default interface IResume {
   _id?: string
   /**
    * link to the version of the schema that can validate the resume
    */
   $schema?: string;
   basics?: IBasics;
   work?: IWorkItem[];
   volunteer?: IVolunteerItem[];
   education?: IEducationItem[];
   /**
    * Specify any awards you have received throughout your professional career
    */
   awards?: IAward[];
   /**
    * Specify any certificates you have received throughout your professional career
    */
   certificates?: ICertificate[];
   /**
    * Specify your publications through your career
    */
   publications?: IPublication[];
   /**
    * List out your professional skill-set
    */
   skills?: ISkill[];
   /**
    * List any other languages you speak
    */
   languages?: ILanguage[];
   interests?: IInterest[];
   /**
    * List references you have received
    */
   references?: IReference[];
   /**
    * Specify career projects
    */
   projects?: IProject[];
   /**
    * The schema version and any other tooling configuration lives here
    */
   meta?: {
     /**
      * URL (as per RFC 3986) to latest version of this document
      */
     canonical?: string;
     /**
      * A version field which follows semver - e.g. v1.0.0
      */
     version?: string;
     /**
      * Using ISO 8601 with YYYY-MM-DDThh:mm:ss
      */
     lastModified?: string;
     [k: string]: unknown;
   };
   createdAt?: Date
   updatedAt?: Date
   __v?: number
 }
 