import { useState } from "react"
import { useCookies } from "react-cookie"

const App = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cookies, setCookie] = useCookies(['token'])
  const [todos, setTodos] = useState([])

  const login = async () => {
    try {

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",//to add creds in the req
        body: JSON.stringify({
          email: email,
          password: password,
        })
      });

      const data = await response.json();

      //setting token in local storage
      localStorage.setItem("token", data.token);

    } catch (error) {
      console.log("something went wrong")
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/todos/cm7rz1fyy00000ki3ylgblvi2`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.token}` // use auth headers when httpOnly is disabled
        },
        credentials: "include",
      });

      const data = await response.json();
      setTodos(data.todos)
      console.log(data)

    } catch (error) {
      console.log(error)
    }
  }
  return (<>
    <h1>
      MERN Auth
    </h1>

    <div className="">
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name" />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        id="password"
        placeholder="password" />
      <button onClick={login}>
        Login
      </button>
    </div>



    <div>
      Todos: <button onClick={fetchTodos} >Fetch Todos</button>
    </div>

    <div>
      {todos.map((item: any, index) => (
        <div key={index}>
          {item.todo}
        </div>
      ))}
    </div>
  </>)
}

export default App