import { useState } from 'react'

import { Dashboard } from './components/Dashboard'
import { Form } from './components/Form'

import type { Gender } from './helpers/fetchGender'
import type { Nation } from './helpers/fetchNation'

export const App = () => {
  const [error, setError] = useState<string | null>(null)
  const [nation, setNation] = useState<Nation | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)

  return (
    <div className='w-full'>
      <Form setError={setError} setNation={setNation} setGender={setGender} />
      {error}
      <Dashboard gender={gender} nation={nation} />
    </div>
  )
}
