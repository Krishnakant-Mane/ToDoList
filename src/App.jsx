import { Auth } from "./components/Auth"
import supabase from "./supabase-client"
import { useEffect, useState } from "react"
import ToDoList from "./components/ToDoList"


function App() {

  const [userSession, setUserSession] = useState(null);

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUserSession(session);
  }

  useEffect(() => {
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);
      setUserSession(session);
    })
    return () => {
      authListener.subscription.unsubscribe();
    }
  }, []);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setUserSession(null);
    }
  }

  return (
    <>
      {
        userSession ?
          <>
            <button className="bg-red-500 text-white px-4 py-2 rounded absolute top-4 right-4 z-50" onClick={logout}>Logout</button>
            <ToDoList session={userSession} />
          </> :
          <Auth />
      }
    </>
  )
}

export default App
