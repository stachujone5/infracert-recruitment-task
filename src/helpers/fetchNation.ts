import axios from 'axios'

interface Country {
  readonly country_id: string
  readonly probability: number
}

export interface Nation {
  readonly country: readonly Country[]
  readonly name: string
}

export const fetchNation = async (name: string) => {
  try {
    const { data } = await axios.get<Nation>(`https://api.nationalize.io?name=${name}`)

    return data
  } catch (err) {
    throw new Error('Failed to fetch nation!')
  }
}
