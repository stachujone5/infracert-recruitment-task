import axios from 'axios'

import { isApiError } from './typeguards'

import type { countries } from '../constants/countries'

interface Country {
  readonly country_id: keyof typeof countries
  readonly probability: number
}

export interface Nations {
  readonly country: readonly Country[]
  readonly name: string
}

export const fetchNations = async (name: string) => {
  try {
    const { data } = await axios.get<Nations>(`https://api.nationalize.io?name=${name}`)

    return data.country
  } catch (err) {
    if (axios.isAxiosError(err) && err.response && isApiError<{ readonly error: string }>(err.response.data)) {
      console.log(err.response.data.error)
    }
    throw new Error('Failed to fetch nations!')
  }
}
