import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ()=> {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // seding our data as a JSON object
  // there are several ways to send the data like urlencoded or etc..
  const registerUser = async (event) => {
    // form have a default nature of redirecting.
    // we need to prevent that.
    event.preventDefault();
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);
    // if the user is registered successfully,
    // we will redirect him/her to the login page.
    if (data.status==="ok") {
      navigate("/login");
  };
}
  

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerUser}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="name"
        />
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
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
