"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {fakeUsers} from "../componets/Login"
import Login from "../componets/Login";

export default function Page() {
  const router = useRouter();
  const [userType, setUserType] = useState("Alumno");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const user = fakeUsers[userType as "Alumno" | "Profesor" | "Administrador"];
    
    if (credentials.username === user.username && credentials.password === user.password) {
      setError("");
      localStorage.setItem("user", JSON.stringify(user));
      router.push(user.redirect);
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <section>
      <Login 
        userType={userType}
        setUserType={setUserType}
        credentials={credentials}
        setCredentials={setCredentials}
        error={error}
        handleInputChange={handleInputChange}
        handleLogin={handleLogin}
      />
    </section>
  );
}
