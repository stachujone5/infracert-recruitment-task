import { useRef, useState } from 'react'

import { COUNTRIES } from '../constants/countries'
import { fetchGender } from '../helpers/fetchGender'
import { fetchNations } from '../helpers/fetchNations'
import { useCooldown } from '../hooks/useCooldown'

import { Tooltip } from './Tooltip'

import type { PersonInfo } from '../App'
import type { FormEvent, Dispatch, SetStateAction } from 'react'

export interface LsName {
  readonly country_id: keyof typeof COUNTRIES | null
  readonly gender: 'male' | 'female' | null
  readonly name: string
}

interface Props {
  readonly checkedNames: readonly LsName[] | null
  readonly personInfo: PersonInfo | null
  readonly setCheckedNames: Dispatch<SetStateAction<readonly LsName[] | null>>
  readonly setPersonInfo: Dispatch<SetStateAction<PersonInfo | null>>
}

const REGEXP = new RegExp('^[a-zA-Z_ ]*$')
const MAX_NAME_LENGTH = 30

export const Form = ({ checkedNames, personInfo, setCheckedNames, setPersonInfo }: Props) => {
  const [tooltipText, setTooltipText] = useState<string | null>(null)
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const [showTooltip, setShowTooltip] = useCooldown()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleTooltip = (text: string) => {
    if (!showTooltip) {
      setShowTooltip()
      setTooltipText(text)
    }
  }

  const handleCopy = () => {
    if (inputRef.current?.value && !personInfo) {
      navigator.clipboard
        .writeText(`name: ${inputRef.current.value}`)
        .then(() => handleTooltip('Copied!'))
        .catch(() => handleTooltip('Failed to copy!'))
      return
    }

    if (!personInfo) {
      handleTooltip('Nothing to copy!')
      return
    }

    // filtering in case of an empty country_id for some names e.g "Szymon"
    const possibleCountries = personInfo?.nations.length
      ? personInfo.nations
          .map(
            nation =>
              nation.country_id &&
              `${COUNTRIES[nation.country_id]} - probability ${Math.round(nation.probability * 100)}%`
          )
          .filter(val => val)
          .join(', ')
      : 'not found'

    const gender = personInfo?.gender ?? 'not found'

    const genderProbability = personInfo?.gender ? `${Math.round(personInfo.genderProbability * 100)}%` : 'not found'

    navigator.clipboard
      .writeText(
        `name: ${
          personInfo?.name ?? 'not found'
        }, possible countries: ${possibleCountries}, gender: ${gender}, gender probability: ${genderProbability}`
      )
      .then(() => handleTooltip('Copied!'))
      .catch(() => handleTooltip('Failed to copy!'))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = inputRef.current?.value

    if (!value) {
      handleTooltip('Enter name!')
      return
    }

    if (!REGEXP.test(value)) {
      handleTooltip('Invalid character!')
      return
    }

    if (value.length > MAX_NAME_LENGTH) {
      handleTooltip('Name is too long!')
      return
    }

    if (checkedNames?.find(user => user.name === value.toLowerCase())) {
      handleTooltip('This name was already checked!')
      return
    }

    setIsFormDisabled(true)

    try {
      const [gender, nations] = await Promise.all([fetchGender(value), fetchNations(value)])

      const LsName = {
        name: value.toLowerCase(),
        gender: gender.gender,
        country_id: nations.length ? nations[0].country_id : null
      }

      checkedNames
        ? localStorage.setItem('names', JSON.stringify([...checkedNames, LsName]))
        : localStorage.setItem('names', JSON.stringify([LsName]))

      setCheckedNames(prev => (prev ? [...prev, LsName] : [LsName]))

      setPersonInfo({ ...gender, nations })
      setTooltipText(null)
      setIsFormDisabled(false)
    } catch (err) {
      err instanceof Error ? handleTooltip(err.message) : handleTooltip('Something went wrong!')
      setPersonInfo(null)
      setIsFormDisabled(false)
    }
  }

  return (
    <div className='form-control w-full max-w-md mx-auto mt-20'>
      <form onSubmit={handleSubmit}>
        <label className='label' htmlFor='name'>
          <span className='label-text'>What is your name?</span>
        </label>
        <div className='flex'>
          <input type='text' id='name' placeholder='Name' className='input input-bordered w-full' ref={inputRef} />
          <button type='button' className='ml-2 btn btn-primary' onClick={handleCopy}>
            Copy
          </button>
        </div>
        <button className='my-2 btn btn-primary btn-block' type='submit' disabled={isFormDisabled}>
          Guess
        </button>
      </form>
      {showTooltip && tooltipText && (
        <Tooltip variant={tooltipText === 'Copied!' ? 'success' : 'error'}>{tooltipText}</Tooltip>
      )}
    </div>
  )
}
