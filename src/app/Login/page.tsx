"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {fakeUsers} from "../componets/Login"
import Login from "../componets/Login"; // Mantiene el componente

export default function Page() {
  const router = useRouter();
  const [userType, setUserType] = useState("Alumno");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // Manejo de inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Función de login con redirección
  const handleLogin = () => {
    const user = fakeUsers[userType as "Alumno" | "Profesor" | "Administrador"]; // Especificamos el tipo aquí
    
    if (credentials.username === user.username && credentials.password === user.password) {
      setError(""); // Limpia errores
      localStorage.setItem("user", JSON.stringify(user)); // Guarda la sesión en localStorage
      router.push(user.redirect); // Redirige al usuario
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