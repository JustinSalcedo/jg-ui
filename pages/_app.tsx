import '../styles/global.css'
import { AppProps } from "next/app";
import { useEffect, useState } from 'react';
// import { IBasics } from '../types/IResume';
import { UserContext } from '../contexts/index';
// import Resume from '../lib/Resume';
import { Auth0Provider, User } from '@auth0/auth0-react';
import { IUser } from '../types/index';
import Client from '../api/Client';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  return {
    props: {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENTID,
      host: process.env.HOST
    }
  }
}

const MOCK_USER = {
  sub: 'jsodfijasewoijfpoe', name: 'Lele Poclo', email: 'mimi@mail.com', email_verified: true
}

const client = new Client('router')

export default function App({ Component, pageProps, domain, clientId, host }: AppProps & { domain: string, clientId: string, host: string }) {
  const router = useRouter()
  
  // const { loginWithRedirect, isAuthenticated, user } = useAuth0()
  // Mock authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocallyAuth, setIsLocallyAuth] = useState(false)
  const [user, setUser] = useState(null as User)
  // const [userBasics, setUserBasics] = useState(new Resume().getBasics())
  const [userRecord, setUserRecord] = useState(null as IUser)
  // const [checkedBackup, setCheckedBackup] = useState(false)

  useEffect(() => {
    // Authorize app
    if (!(isAuthenticated || isLocallyAuth)) attempt2RestoreSession()
    // restoreUserBasics()
    if (isAuthenticated && !userRecord) loadUser(user)
  }, [isAuthenticated, userRecord])

  async function attempt2RestoreSession() {
    try {
      const userStr = window.sessionStorage.getItem('user')
      await loadUser(JSON.parse(userStr))
    } catch (error) {
      setIsLocallyAuth(false)
      sessionStorage.clear()
      router.push('/')
    }
  }

  // function restoreUserBasics() {
  //   const userBasicsString = window.localStorage.getItem('userBasics')
  //   if (userBasicsString && !checkedBackup) {
  //     setUserBasics(JSON.parse(userBasicsString))
  //   }
  //   setCheckedBackup(true)
  // }

  // function handleBasics(inputBasics: Partial<IBasics>) {
  //   setUserBasics(basics => ({ ...basics, ...inputBasics }))
  // }

  // Mock login
  useEffect(() => {
    if (user && !isAuthenticated) {
      setIsLoading(true)
      setIsAuthenticated(true)
    }
    if (userRecord && isLoading) setIsLoading(false)
  }, [user, userRecord])

  async function loginWithRedirect() {
      setUser(MOCK_USER)
      return Promise.resolve()
  }

  async function login() {
    try {
      await loginWithRedirect()
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    setIsLocallyAuth(false)
    setUserRecord(null)
    //
    setUser(null)
    setIsAuthenticated(false)
    //
    sessionStorage.clear()
    router.push('/')
  }

  async function loadUser({ sub, name, email, email_verified }: User) {
    try {
      const userPayload = await client.loginUser({ sub, name, email, email_verified })
      setUserRecord(userPayload)
      setIsLocallyAuth(true)
      saveSession({ sub, name, email, email_verified })
    } catch (error) {
      throw error
    }
  }

  function saveSession(user: User) {
    window.sessionStorage.setItem('user', JSON.stringify(user))
  }

  function handleUserRecord(inputUser: IUser) {
    setUserRecord(inputUser)
  }

  return (
    <Auth0Provider
      domain={domain} clientId={clientId} redirectUri={host}
    >
      <UserContext.Provider value={{
        userRecord, handleUserRecord, login, isAuth: isAuthenticated,
        isLoading, logout: logout, isLocallyAuth
      }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </Auth0Provider>
  )
}
