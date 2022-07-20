import '../styles/global.css'
import { AppProps } from "next/app";
import { useEffect, useState } from 'react';
import { IBasics } from '../types/IResume';
import { UserBasicsContext } from '../context/index';
import Resume from '../lib/Resume';

export default function App({ Component, pageProps }: AppProps) {

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
    <UserBasicsContext.Provider value={{ userBasics, handleUserBasics: handleBasics.bind(this) }}>
      <Component {...pageProps} />
    </UserBasicsContext.Provider>
  )
}
