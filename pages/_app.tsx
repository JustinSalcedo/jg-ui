import '../styles/global.css'
import { AppProps } from "next/app";
import { Dispatch, SetStateAction, useState } from 'react';
import IResume from '../types/IResume';
import { NewResumeContext } from '../context/index';
import sampleResume from '../lib/sampleResume';

export default function App({ Component, pageProps }: AppProps) {
  const [newResume, setNewResume] = useState(sampleResume) as [IResume, Dispatch<SetStateAction<IResume>>]

  function handleResume(inputResume: IResume) {
    setNewResume(resume => ({ ...resume, ...inputResume }))
  }

  return (
    <NewResumeContext.Provider value={{newResume, handleNewResume: handleResume.bind(this)}}>
      <Component {...pageProps} />
    </NewResumeContext.Provider>
  )
}
