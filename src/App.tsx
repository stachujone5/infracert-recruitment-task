import { useState } from 'react'

import { Dashboard } from './components/Dashboard'
import { Form } from './components/Form'
import { NamesList } from './components/NamesList'
import { getStorage } from './helpers/handleStorage'

import type { LsName } from './components/Form'
import type { Gender } from './helpers/fetchGender'
import type { Nations } from './helpers/fetchNations'

/* 

External libraries used { 

  Axios: Fetching, network error handling (res.ok), parsing JSON,
  Tailwind & DaisyUI: Styling

}

*/

export interface PersonInfo {
  readonly gender: Gender['gender']
  readonly genderProbability: Gender['probability']
  readonly name: string
  readonly nations: Nations['country']
}

export const App = () => {
  const [personInfo, setPersonInfo] = useState<PersonInfo | null>(null)
  const [checkedNames, setCheckedNames] = useState(getStorage<readonly LsName[]>('names'))

  return (
    <div className='w-full'>
      <Form
        setPersonInfo={setPersonInfo}
        personInfo={personInfo}
        setCheckedNames={setCheckedNames}
        checkedNames={checkedNames}
      />
      {personInfo && <Dashboard personInfo={personInfo} />}
      {checkedNames && <NamesList checkedNames={checkedNames} setCheckedNames={setCheckedNames} />}
    </div>
  )
}
