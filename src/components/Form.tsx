import { useEffect, useRef, useState } from 'react'

import { fetchGender } from '../helpers/fetchGender'
import { fetchNation } from '../helpers/fetchNation'

import type { Gender } from '../helpers/fetchGender'
import type { Nation } from '../helpers/fetchNation'
import type { FormEvent, Dispatch, SetStateAction } from 'react'

interface Props {
  readonly setError: Dispatch<SetStateAction<string | null>>
  readonly setGender: Dispatch<SetStateAction<Gender | null>>
  readonly setNation: Dispatch<SetStateAction<Nation | null>>
}

export const Form = ({ setError, setGender, setNation }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()

  const handleCopy = () => {
    if (!inputRef.current || !inputRef.current.value || showTooltip) return

    void navigator.clipboard.writeText(inputRef.current.value)
    setShowTooltip(true)
    timeoutRef.current = setTimeout(() => setShowTooltip(false), 1500)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputRef.current || !inputRef.current.value) return

    try {
      const gender = await fetchGender(inputRef.current.value)
      const nation = await fetchNation(inputRef.current.value)

      setGender(gender)
      setNation(nation)
    } catch (err) {
      typeof err === 'string' && setError(err)
    }
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

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
        <button className='my-2 btn btn-outline btn-block' type='submit'>
          Guess
        </button>
      </form>
      {showTooltip && <div className='tooltip tooltip-success tooltip-bottom tooltip-open' data-tip='Copied!' />}
    </div>
  )
}
