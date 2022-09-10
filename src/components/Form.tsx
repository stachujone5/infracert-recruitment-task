import { useRef, useState } from 'react'

import { fetchGender } from '../helpers/fetchGender'
import { fetchNations } from '../helpers/fetchNations'
import { getStorage } from '../helpers/handleStorage'
import { useCooldown } from '../hooks/useCooldown'

import { Tooltip } from './Tooltip'

import type { PersonInfo } from '../App'
import type { FormEvent, Dispatch, SetStateAction } from 'react'

interface Props {
  readonly setPersonInfo: Dispatch<SetStateAction<PersonInfo | null>>
}

const REGEXP = new RegExp('^[a-zA-Z_ ]*$')

export const Form = ({ setPersonInfo }: Props) => {
  const [tooltipText, setTooltipText] = useState<string | null>(null)
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const [showTooltip, setShowTooltip] = useCooldown()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    if (!inputRef.current || !inputRef.current.value || showTooltip) return

    void navigator.clipboard.writeText(inputRef.current.value)
    setTooltipText('Copied!')
    setShowTooltip()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const value = inputRef.current?.value

    if (!value) return

    if (!REGEXP.test(value)) {
      setTooltipText('Invalid character!')
      setShowTooltip()
      return
    }

    const checkedNames = getStorage<readonly string[]>('names')

    if (checkedNames?.includes(value)) {
      setTooltipText('This name was already checked!')
      setShowTooltip()
      return
    }

    setIsFormDisabled(true)
    checkedNames
      ? localStorage.setItem('names', JSON.stringify([...checkedNames, value]))
      : localStorage.setItem('names', JSON.stringify([value]))

    try {
      const [gender, nations] = await Promise.all([fetchGender(value), fetchNations(value)])

      setPersonInfo({ ...gender, nations })
      setTooltipText(null)
      setIsFormDisabled(false)
    } catch (err) {
      setTooltipText('Something went wrong!')
      setShowTooltip()
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
          <button type='button' className='ml-2 btn btn-outline' onClick={handleCopy}>
            Copy
          </button>
        </div>
        <button className='my-2 btn btn-outline btn-block' type='submit' disabled={isFormDisabled}>
          Guess
        </button>
      </form>
      {showTooltip && tooltipText && (
        <Tooltip variant={tooltipText === 'Copied!' ? 'success' : 'error'}>{tooltipText}</Tooltip>
      )}
    </div>
  )
}
