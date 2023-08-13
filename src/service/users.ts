import { type UserResponse } from '../types.d'

export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }): Promise<UserResponse> => await fetch(`https://randomuser.me/api?results=10&seed=midudev&page=${pageParam}`)
  .then(async (res) => {
    if (!res.ok) throw new Error('Error en la peticion')
    return await res.json()
  })
  .then((res) => {
    const currentPage = Number(res.info.page)
    return {
      users: res.results,
      nextCursor: currentPage > 3 ? undefined : currentPage + 1
    }
  })
