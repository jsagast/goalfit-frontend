const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/exercises`;

const all = async () => {
  try {
  const res = await fetch(BASE_URL,{
    headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
  })
  if (!res.ok) throw new Error('Failed to fetch exercises')
  return res.json()
  } catch (err){
    console.log(err)
  }
};


const show = async (exerciseId) => {
  const res = await fetch(`${BASE_URL}/${exerciseId}`)
  if (!res.ok) throw new Error('Failed to fetch exercise')
  return res.json()
}

export { all, show }
