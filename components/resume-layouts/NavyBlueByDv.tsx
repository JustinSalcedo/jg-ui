import { dateToMonthDay } from "../../lib/formatDate";
import IResume from "../../types/IResume";

const colors = {
    deepBlue: '#002060',
    lightBlue: '#05b0f0',
    navyBlue: '#135793',
    gray: '#dfe0e0'
}

export default function NavyBlueByDv({ resume, scale, page }: { resume: IResume, scale: number, page: number }) {
    const { basics, skills, work, education, certificates, projects } = resume
    const coursework = education.filter(({ studyType }) => studyType === "Coursework")

    return (
        <div className="container">
            {page === 1 ? (<>
                <header>
                    <h1>{basics.name}</h1>
                    <section className="contact">
                        <a href={basics.phone ? `tel: +1${parseInt(basics.phone.replace(/[^0-9]/g, '')) }` : '#'} className="phone">{basics.phone}</a>{` | `}
                        <a href={basics.email ? `mailto: ${basics.email}` : '#'} className="email">{basics.email}</a>{` | `}
                        <address>{basics.location.region}, {basics.location.postalCode}</address>
                        <br/>
                        {/* TODO: Select exact linkedin profile and trim HTTPS from url */}
                        <a href={basics.profiles[0].url ? basics.profiles[0].url : '#'} className="linkedIn">{basics.profiles[0].url}</a>
                    </section>
                    <h2>{basics.label || 'Job Title'}</h2>
                    <a href={basics.url ? basics.url : '#'} className="portfolio">{basics.url}</a>
                </header>
                <main>
                    <ul className="summary">
                        {basics.summary.split('\n').map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                    <h3>Skills</h3>
                    <ul className="skillset">
                        {skills.map(({ name: skill }, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                    <h3>Education</h3>
                    <section className="education">
                            {education.filter(({ studyType }) => studyType !== 'Coursework').map((edu, index) => (
                                <div className="education-xp" key={index}>
                                    {/* TODO: Add specialty and location to the resume schema */}
                                    <div className="degree">{edu.studyType}, {edu.area}, {edu.specialization ? (<span className="special">{edu.specialization}</span>) : ''}</div><br/><span className="date">{edu.endDate ? dateToMonthDay(edu.endDate) : 'In Progress'}</span>
                                    <div className="school"><a href={edu.url ? edu.url : '#'}>{edu.institution}</a>{edu.location ? (<span className="location"> - {edu.location}</span>) : ''}</div>
                                    <div className="coursework">{edu.courses.join(', ')}</div>
                                </div>
                            ))}
                    </section>
                    <hr />
                    {(certificates || coursework.length) ? (
                        <>
                            <h3>Certifications</h3>
                            {certificates && (
                                <ul className="certs">
                                    {certificates.map((cert, index) => (
                                        // TODO: Format date
                                        <li key={index} className="cert"><a href={cert.url ? cert.url : '#'}>{cert.name}</a> <span className="type">{cert.issuer}</span><span className="date"> - {cert.date}</span></li>
                                    ))}
                                </ul>
                            )}
                            {coursework.length ? (
                                <section className="courses">
                                    {coursework.map((course, index) => (
                                        <div className="cert-xp" key={index}>
                                            {/* TODO: Format date */}
                                            <div className="cert-name"><a href="#">{course.institution}</a>: {course.area}</div><span className="date"> - {course.endDate || 'In Progress'}</span>
                                            <div className="coursework">{course.courses.join(', ')}</div>
                                        </div>
                                    ))}
                                </section>
                            ) : ''}
                            <hr />
                        </>
                    ) : ''}
                    <h3>Professional experience</h3>
                    <section className="workHistory">
                        {work.map((w, index) => (
                            <div className="work-xp" key={index}>
                                <div className="job-title">
                                    {/* TODO: Format date */}
                                    <a href={w.url ? w.url : '#'}><h4>{w.position}</h4></a><span className="date">{` │ ${w.startDate ? dateToMonthDay(w.startDate) + ' - ' : ''}${w.endDate ? dateToMonthDay(w.endDate) : 'Current'}`}</span>
                                </div>
                                <p className="location">{w.name}, {w.location}</p>
                                <ul className="description">
                                    {w.highlights.map((high, index) => (
                                        <li key={index}>{high}</li>
                                    ))}
                                </ul>
                                {/* <p className="achievements"><span>Key Achievements: <br/></span> Stablished the former web application architecture, led technical documentation, and managed MVP's production through a waterfall-alike workflow in a remote-work environment.</p> */}
                            </div>
                        ))}
                    </section>
                </main>
            </>) : ''}
            {page === 2 ? (<>
                <main>
                <h3>Portfolio</h3>
                    <section className="portfolio">
                        {projects.map((proj, index) => (
                            <div className="project" key={index}>
                                <div className="proj-title">
                                    {/* TODO: Format date */}
                                    <a href={proj.url ? proj.url : '#'}><h4>{proj.name} {proj.type ? `(${proj.type})` : ''}</h4></a><span className="date">{` │ ${proj.startDate ? dateToMonthDay(proj.startDate) + ' - ' : ''}${proj.endDate ? dateToMonthDay(proj.endDate) : 'Work in progress'}`}</span>
                                </div>
                                <p className="keywords">{proj.keywords.join(', ')}</p>
                                <ul className="description">
                                    {proj.highlights.map((high, index) => (
                                        <li key={index}>{high}</li>
                                    ))}
                                </ul>
                                {/* <p className="achievements"><span>Key Achievements: <br/></span> Stablished the former web application architecture, led technical documentation, and managed MVP's production through a waterfall-alike workflow in a remote-work environment.</p> */}
                            </div>
                        ))}
                    </section>
                </main>
            </>) : ''}
            {/* @ts-ignore */}
            <style jsx>{`
                body {
                    position: relative;
                }
                .container {
                    margin: 0%;
                    padding: 0 0 ${scale}rem 0;
                    width: ${8.5 * scale}in;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: ${12 * scale}pt;
                    text-align: center;
                    background: white;
                }
                .container > header {
                    background-color: ${colors.deepBlue};
                    color: white;
                    padding: ${12 * scale}pt 0%;
                }
                h1 {
                    margin: 0%;
                    color: ${colors.lightBlue};
                }
                h2 {
                    background-color: ${colors.lightBlue};
                    color: ${colors.deepBlue};
                    margin: ${6 * scale}pt 0%;
                }
                header > .contact > *:not(:last-child) {
                    display: inline-block;
                }
                header > .contact > *, header a {
                    color: white;
                    font-style: inherit;
                    text-decoration: none;
                }
                main > .summary {
                    list-style-type: '♢  ';
                    text-align: left;
                    margin: ${3 * scale}pt 0%;
                    padding-left: ${0.75 * scale}in;
                    padding-right: ${0.5 * scale}in;
                }
                .summary > li::marker {
                    color: ${colors.deepBlue};
                }
                h3 {
                    color: ${colors.navyBlue};
                    margin: 0%;
                    margin-bottom: ${3 * scale}pt;
                }
                main > .skillset {
                    background-color: ${colors.gray};
                    padding: ${12 * scale}pt 0%;
                    border: ${2 * scale}px solid ${colors.lightBlue};
                    border-left: none;
                    border-right: none;
                    margin: 0%;
                    margin-bottom: ${3 * scale}pt;
                    list-style: none;
                }
                .skillset > li {
                    display: inline-block;
                }
                .skillset > li:not(:first-child)::before {
                    content: ' | ';
                }
                .skillset > li:not(:last-child) {
                    padding-right: ${0.5 * scale}rem;
                }
                .education-xp {
                    margin: 0%;
                    padding: 0% ${0.5 * scale}in;
                    text-align: left;
                }
                .education-xp > .degree {
                    font-weight: bold;
                    display: inline-block;
                }
                .education-xp > .date, .education-xp > .school > .location {
                    font-style: italic;
                }
                .education-xp > .date {
                    padding-right: ${0.5 * scale}rem;
                }
                .education-xp > .school {
                    display: inline-block;
                }
                .education-xp > .school > a {
                    color: ${colors.deepBlue};
                    text-decoration: none;
                }
                .education-xp > .school::before {
                    content: '| ';
                }
                .coursework {
                    padding-left: ${0.25 * scale}in;
                }
                .coursework::before {
                    content: "Relevant Coursework: ";
                    font-weight: bold;
                }
                hr {
                    border: ${1 * scale}px solid ${colors.lightBlue};
                    margin: ${3 * scale}pt 0%;
                }
                .certs {
                    margin: 0%;
                    padding: 0%;
                    margin-bottom: ${3 * scale}pt;
                }
                .certs > .cert {
                    font-weight: bold;
                }
                .certs > .cert > a {
                    color: inherit;
                    text-decoration: none;
                }
                .certs > .cert:nth-child(-1) {
                    margin-bottom: ${3 * scale}pt;
                }
                .cert .type, .cert .date {
                    font-weight: initial;
                }
                .cert-xp {
                    margin: 0%;
                    padding: 0% ${0.5 * scale}in;
                    text-align: left;
                }
                .cert-xp > .cert-name {
                    font-weight: bold;
                    display: inline-block;
                }
                .cert-xp > .cert-name > a {
                    color: ${colors.navyBlue};
                    text-decoration: none;
                }
                .cert-xp > .date {
                    font-style: italic;
                }
                .coursework > span {
                    font-weight: bold;
                }
                h4 {
                    color: ${colors.navyBlue};
                    margin: 0%;
                    display: inline-block;
                }
                .work-xp {
                    margin: 0%;
                    padding: 0% ${0.5 * scale}in;
                    text-align: left;
                    margin-bottom: ${6 * scale}pt;
                }
                .work-xp > .job-title {
                    font-weight: bold;
                }
                .work-xp > .location {
                    font-weight: bold;
                    margin: 0%;
                }
                .work-xp > .description {
                    list-style-type: circle;
                    margin: 0%;
                    padding-left: ${0.25 * scale}in;
                    margin-bottom: ${3 * scale}pt;
                }
                .work-xp > .description > li::marker {
                    color: ${colors.deepBlue};
                }
                .work-xp > .achievements {
                    padding-left: ${0.25 * scale}in;
                    margin: 0%;
                }
                .work-xp > .achievements > span {
                    font-weight: bold;
                    color: ${colors.navyBlue};
                }
                .project {
                    margin: 0%;
                    padding: 0% ${0.5 * scale}in;
                    text-align: left;
                    margin-bottom: ${6 * scale}pt;
                }
                .project > .proj-title {
                    font-weight: bold;
                }
                .project > .keywords {
                    font-weight: bold;
                    margin: 0%;
                }
                .project > .description {
                    list-style-type: circle;
                    margin: 0%;
                    padding-left: ${0.25 * scale}in;
                    margin-bottom: ${3 * scale}pt;
                }
                .project > .description > li::marker {
                    color: ${colors.deepBlue};
                }
            `}</style>
        </div>
    )
}
