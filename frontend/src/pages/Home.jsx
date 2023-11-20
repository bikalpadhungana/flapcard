import { useAuthContext } from "../hooks/use.auth.context"

export default function Home() {

  const { user } = useAuthContext();

  return (
    <div>{user && <p>{ JSON.stringify(user) }</p>}</div>
  )
} 
