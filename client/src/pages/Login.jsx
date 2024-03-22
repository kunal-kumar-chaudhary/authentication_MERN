import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // seding our data as a JSON object
  // there are several ways to send the data like urlencoded or etc..
  const loginUser = async (event) => {
    // form have a default nature of redirecting.
    // we need to prevent that.
    event.preventDefault();
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (data.user) {

      localStorage.setItem("token", data.user);
      alert("login successful");
      navigate("/dashboard");
    }else{
      alert("login failed");}
  };
  

  return (
    <div>
      <h1>login</h1>
      <form onSubmit={loginUser}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
