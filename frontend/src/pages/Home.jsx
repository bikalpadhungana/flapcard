import { useAuthContext } from "../hooks/use.auth.context";

export default function Home() {

  const { user } = useAuthContext();

  return (
    <div className="container">
      <div className="bg">{user && <p>{ JSON.stringify(user) }</p>}</div>
    </div>
  )
} 