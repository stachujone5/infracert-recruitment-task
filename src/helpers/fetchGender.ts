import axios from 'axios'

export interface Gender {
  readonly count: number
  readonly gender: 'male' | 'female' | null
  readonly name: string
  readonly probability: number
}

export const fetchGender = async (name: string) => {
  try {
    const { data } = await axios.get<Gender>(`https://api.genderize.io?name=${name}`)

    return { gender: data.gender, genderProbability: data.probability }
  } catch (err) {
    throw new Error('Failed to fetch gender!')
  }
}
