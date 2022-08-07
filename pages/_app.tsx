import '../styles/global.css'
import { AppProps } from "next/app";
import { useEffect, useMemo, useState } from 'react';
import { IBasics } from '../types/IResume';
import { UserBasicsContext } from '../contexts/index';
import Resume from '../lib/Resume';
import { Auth0Provider } from '@auth0/auth0-react';

export async function getStaticProps() {
  return {
    props: {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENTID,
      host: process.env.HOST
    }
  }
}

export default function App({ Component, pageProps, domain, clientId, host }: AppProps & { domain: string, clientId: string, host: string }) {

  const [userBasics, setUserBasics] = useState(new Resume().getBasics())
  const [checkedBackup, setCheckedBackup] = useState(false)

  useEffect(() => {
    restoreUserBasics()
  })

  function restoreUserBasics() {
    const userBasicsString = window.localStorage.getItem('userBasics')
    if (userBasicsString && !checkedBackup) {
      setUserBasics(JSON.parse(userBasicsString))
    }
    setCheckedBackup(true)
  }

  function handleBasics(inputBasics: Partial<IBasics>) {
    setUserBasics(basics => ({ ...basics, ...inputBasics }))
  }

  return (
    <Auth0Provider
      domain={domain} clientId={clientId} redirectUri={host}
    >
      <UserBasicsContext.Provider value={{ userBasics, handleUserBasics: handleBasics.bind(this) }}>
        <Component {...pageProps} />
      </UserBasicsContext.Provider>
    </Auth0Provider>
  )
}
