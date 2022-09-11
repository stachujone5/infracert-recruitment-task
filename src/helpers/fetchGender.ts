import axios from 'axios'

import { isApiError } from './typeguards'

export interface Gender {
  readonly count: number
  readonly gender: 'male' | 'female' | null
  readonly name: string
  readonly probability: number
}

export const fetchGender = async (name: string) => {
  try {
    const { data } = await axios.get<Gender>(`https://api.genderize.io?name=${name}`)

    return { gender: data.gender, genderProbability: data.probability, name: data.name }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && isApiError(err.response.data)) {
        const { error } = err.response.data

        throw new Error(error)
      }
      if (err.request) {
        throw new Error('Failed to fetch gender, no response received!')
      }
    }
    throw new Error('Failed to fetch gender!')
  }
}
