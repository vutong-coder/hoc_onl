import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

export async function fetchRecentExams(): Promise<number> {
	const res = await api.get<{ count: number }>('/exams/recent')
	return res.data.count
}


