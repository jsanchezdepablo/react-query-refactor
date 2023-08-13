import { useUsers } from '../hooks/useUsers'

const Results = () => {
  const { users } = useUsers()

  // A traves de react-query, podemos generar estados globales
  // a pesar de volver a llamar al hook, la libreria es suficiente inteligente
  // para cachear la llamada y devolvernos los users sin necesidad de realizar otra peticion
  // ya que sabe que los datos no han cambiado y por tanto no tiene que vovler a realizar el fetch

  return <h3>Resultado: {users.length} usuarios</h3>
}

export default Results
