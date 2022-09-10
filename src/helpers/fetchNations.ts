import axios from 'axios'

interface Country {
  readonly country_id: string
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
    throw new Error('Failed to fetch nations!')
  }
}
