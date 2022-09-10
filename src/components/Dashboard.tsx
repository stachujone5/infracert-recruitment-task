import { Fragment } from 'react'

import type { Gender } from '../helpers/fetchGender'
import type { Nation } from '../helpers/fetchNation'

interface Props {
  readonly gender: Gender | null
  readonly nation: Nation | null
}

export const Dashboard = ({ gender, nation }: Props) => {
  if (!gender || !nation) return null

  return (
    <div className='mt-10 w-full max-w-md mx-auto'>
      <h2 className='text-3xl text-center mb-4'>Our prediction</h2>
      <div className='flex flex-col items-center'>
        <div className='stats stats-vertical shadow'>
          <div className='stat'>
            <div className='stat-title text-center text-xl'>Nationality</div>
            {nation.country.map((country, i) => (
              <Fragment key={`${Math.random() * i}`}>
                <div className='stat-value text-primary'>
                  #{i + 1} {country.country_id}
                </div>
                <div className='stat-desc my-2'>Probability {Number(country.probability.toFixed(2)) * 100}%</div>
              </Fragment>
            ))}
          </div>
          <div className='stat'>
            <div className='stat-value text-primary'>
              {gender.gender ? gender.gender[0].toUpperCase() + gender.gender.slice(1).toLowerCase() : "Don't know :("}
            </div>
            <div className='stat-desc my-2'>Probability {Number(gender.probability.toFixed(2)) * 100}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
