import { Fragment } from 'react'

import { countries } from '../constants/countries'

import type { PersonInfo } from '../App'

interface Props {
  readonly personInfo: PersonInfo
}

export const Dashboard = ({ personInfo }: Props) => {
  const { gender, genderProbability, nations } = personInfo

  return (
    <div className='mt-10 w-full max-w-md mx-auto'>
      <h2 className='text-3xl text-center mb-4'>Our prediction</h2>
      <div className='stats stats-vertical shadow w-full'>
        <div className='stat'>
          <div className='stat-title text-center text-xl'>Nationality</div>
          {nations.map(
            (nation, i) =>
              // Api returns empty country_id for some names e.g. "Szymon"
              nation.country_id && (
                <Fragment key={`${Math.random() * i}`}>
                  <div className='stat-value text-primary'>
                    #{i + 1} {countries[nation.country_id]}
                  </div>
                  <div className='stat-desc my-2'>Probability {Math.round(Number(nation.probability) * 100)}%</div>
                </Fragment>
              )
          )}
          {nations.length === 0 && <div className='stat-value text-primary'>Not found</div>}
        </div>
        <div className='stat'>
          <div className='stat-title text-center text-xl'>Gender</div>
          <div className='stat-value text-primary'>
            {gender ? gender[0].toUpperCase() + gender.slice(1).toLowerCase() : 'Not found'}
          </div>
          {gender && <div className='stat-desc my-2'>Probability {Math.floor(Number(genderProbability) * 100)}%</div>}
        </div>
      </div>
    </div>
  )
}