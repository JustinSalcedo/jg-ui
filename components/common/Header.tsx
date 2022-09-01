import { ReactNode } from "react";

export default function Header({ headerButtons, logo }: { headerButtons?: ReactNode[], logo?: true }) {
    return (
        <>
            <header className={!logo ? 'no-logo' : ''}>
                {logo ? (<h1>Job Gatherer</h1>): ''}
                {headerButtons ? ( <div>{headerButtons.map((button, index) => (
                    <span key={index}>{button}</span>
                ))}</div> ) : ''}
            </header>
            {/* @ts-ignore */}
            <style jsx>{`
                header {
                    grid-area: header;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                header.no-logo {
                    justify-content: end;
                }
                h1 {
                    font-size: 1.5rem;
                }
                div {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                }
                div > span {
                    margin-left: 2rem;
                }
            `}</style>
        </>
    )
}