const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/exercises`;

const index = async () => {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch exercises')
  return res.json()
}


const show = async (exerciseId) => {
  const res = await fetch(`${BASE_URL}/${exerciseId}`)
  if (!res.ok) throw new Error('Failed to fetch exercise')
  return res.json()
}

export { index, show }
