import axios from 'axios'

import { isApiError } from './typeguards'

import type { COUNTRIES } from '../constants/countries'

interface Country {
  readonly country_id: keyof typeof COUNTRIES
  readonly probability: number
}

export interface Nations {
  readonly country: readonly Country[]
  readonly name: string
}

export const fetchNations = async (name: string) => {
  try {
    const { data } = await axios.get<Nations>(`https://api.nationalize.io?name=${encodeURIComponent(name)}`)

    return data.country
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && isApiError(err.response.data)) {
        const { error } = err.response.data

        throw new Error(error)
      }
      if (err.request) {
        throw new Error('Failed to fetch nations, no response received!')
      }
    }
    throw new Error('Failed to fetch nations!')
  }
}
