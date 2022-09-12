import { COUNTRIES } from '../constants/countries'

import type { LsName } from './Form'
import type { SetStateAction, Dispatch } from 'react'

interface Props {
  readonly checkedNames: readonly LsName[]
  readonly setCheckedNames: Dispatch<SetStateAction<readonly LsName[] | null>>
}

export const NamesList = ({ checkedNames, setCheckedNames }: Props) => {
  return (
    <>
      <div className='collapse collapse-arrow mt-10 w-full max-w-md mx-auto outline outline-1 rounded-xl'>
        <input type='checkbox' />
        <div className='collapse-title text-xl font-medium text-center'>Checked names</div>
        <ul className='collapse-content'>
          {checkedNames.map(name => (
            <li className='text-primary-focus border-b-2 border-white/10' key={name.name}>
              <ul>
                <li>
                  <span className='text-white'>Name: </span>
                  {name.name}
                </li>
                <li>
                  <span className='text-white'>Country: </span>
                  {name.country_id ? COUNTRIES[name.country_id] : 'Not found'}
                </li>
                <li>
                  <span className='text-white'>Gender: </span>
                  {name.gender ?? 'Not found'}
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <button
        className='btn btn-primary fixed bottom-10 left-10'
        onClick={() => {
          localStorage.removeItem('names')
          setCheckedNames(null)
        }}
      >
        Clear list
      </button>
    </>
  )
}
