import '../styles/global.css'
import { AppProps } from "next/app";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import IResume, { IBasics } from '../types/IResume';
import { NewResumeContext, UserBasicsContext } from '../context/index';
import sampleResume from '../lib/sampleResume';
import Resume from '../lib/Resume';

export default function App({ Component, pageProps }: AppProps) {

  const [newResume, setNewResume] = useState(sampleResume) as [IResume, Dispatch<SetStateAction<IResume>>]
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

  function handleResume(inputResume: IResume) {
    setNewResume(resume => ({ ...resume, ...inputResume }))
  }

  function handleBasics(inputBasics: Partial<IBasics>) {
    setUserBasics(basics => ({ ...basics, ...inputBasics }))
  }

  return (
    <UserBasicsContext.Provider value={{ userBasics, handleUserBasics: handleBasics.bind(this) }}>
      {/* <NewResumeContext.Provider value={{newResume, handleNewResume: handleResume.bind(this)}}> */}
        <Component {...pageProps} />
      {/* </NewResumeContext.Provider> */}
    </UserBasicsContext.Provider>
  )
}
