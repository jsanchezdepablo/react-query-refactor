import { useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'
import './App.css'
interface UserResponse {
  users: User[]
  nextCursor?: number
}

const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }): Promise<UserResponse> => await fetch(`https://randomuser.me/api?results=10&seed=midudev&page=${pageParam}`)
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

function App () {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: fetchUsers, // el hook es el encargado de pasar la info necesaria al fetchUsers
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor // aquí definimos el valor de pageParam que recibe la queryFn
  })

  const users: User[] = data?.pages?.flatMap(({ users }) => users) ?? []

  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    void refetch()
  }

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter((user) => user.email !== email)
    // setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  const filteredUsers = useMemo(() => {
    console.log('calculate filteredUsers')
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
        return user.location.country
          .toLowerCase()
          .includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    console.log('calculate sortedUsers')

    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>Colorear files</button>

        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por país'
            : 'Ordenar por país'}
        </button>

        <button onClick={handleReset}>Resetear estado</button>

        <input
          placeholder='Filtra por país'
          onChange={(e) => {
            setFilterCountry(e.target.value)
          }}
        />
      </header>
      <main>
        {users.length > 0 && <UsersList
          changeSorting={handleChangeSort}
          deleteUser={handleDelete}
          showColors={showColors}
          users={sortedUsers}
                             />}
        {isLoading && <p>Cargando</p>}
        {isError && <p>Ha habido un error</p>}
        {!isLoading && !isError && users.length === 0 && <p>No hay usuarios</p>}
        {!isLoading && !isError && hasNextPage === true && <button onClick={() => { void fetchNextPage() }}>Cargar más resultados</button>}
        {!isLoading && !isError && hasNextPage === false && <p>No hay más resultados</p>}

      </main>
    </div>
  )
}

export default App
