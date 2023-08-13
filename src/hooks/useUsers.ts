import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchUsers } from '../service/users'

export const useUsers = () => {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers, // el hook es el encargado de pasar la info necesaria al fetchUsers
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor, // aquí definimos el valor de pageParam que recibe la queryFn
    staleTime: 1000 * 5 // 5 seconds
    // refetchOnWindowFocus: false
  })

  return {
    refetch,
    fetchNextPage,
    isLoading,
    isError,
    hasNextPage,
    users: data?.pages?.flatMap(({ users }) => users) ?? []
  }
}
