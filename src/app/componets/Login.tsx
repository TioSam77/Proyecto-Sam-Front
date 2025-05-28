'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "@/app/css/Login.module.css"

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/../firebase/clientApp"
import { useRouter } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { setCookie } from 'cookies-next';
import Link from "next/link";

interface LoginProps {
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
}

const Login: React.FC<LoginProps> = ({
  userType,
  setUserType,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  const [
    signInWithEmailAndPassword,
    firebaseAuthUser,
    loadingfirebase,
    firebaseError
  ] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (!firebaseError?.message) return;

    const message = firebaseError.message;
    const errorCode = message.match(/auth\/[a-zA-Z0-9-_]+/)?.[0];

    switch (errorCode) {
      case "auth/email-already-in-use":
        setError("Ese correo ya está registrado. Intenta iniciar sesión.");
        break;
      case "auth/invalid-email":
        setError("Ese correo es inválido.");
        break;
      case "auth/weak-password":
        setError("La contraseña es muy débil. Usa al menos 6 caracteres.");
        break;
      case "auth/missing-password":
        setError("La contraseña es obligatoria.");
        break;
      case "auth/operation-not-allowed":
        setError("La creación de cuentas está deshabilitada temporalmente.");
        break;
      case "auth/too-many-requests":
        setError("Demasiados intentos fallidos. Intenta de nuevo más tarde.");
        break;
      default:
        setError("Ocurrió un error al intentar ingresar como usuario. Intenta nuevamente.");
        break;
    }
  }, [firebaseError]);

  useEffect(() => {
    const checkLogin = async () => {
      if (!firebaseAuthUser || !firebaseAuthUser.user) return;

      let roleCollection = "";
      let redirectPath = "";

      switch (userType) {
        case "Alumno":
          roleCollection = "student";
          redirectPath = "/Alumno";
          break;
        case "Profesor":
          roleCollection = "teacher";
          redirectPath = "/Profesor";
          break;
        case "Administrador":
          roleCollection = "admin";
          redirectPath = "/Administrador";
          break;
        default:
          setError("Rol no válido.");
          return;
      }

      const uid = firebaseAuthUser.user.uid;
      console.log(uid)
      const docRef = doc(db, roleCollection, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const idToken = await firebaseAuthUser.user.getIdToken();
        setCookie("token", idToken);

        router.push(redirectPath);
      } else {
        setError("Credenciales incorrectas o error en la autenticación.");
      }
    };

    checkLogin();
  }, [firebaseAuthUser]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (!alert) return;
    const timeout = setTimeout(() => setAlert(""), 5000);
    return () => clearTimeout(timeout);
  }, [alert]);

  const router = useRouter()

  const handleSignIn = async () => {

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setError(""); // limpiar error anterior
    setAlert("");
    await signInWithEmailAndPassword(email, password);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeText}>Bienvenido a Interactivo</h1>
      <div className={styles.boxWrapper}>
        <div className={styles.borderGradient}></div> {/* Borde degradado */}

        <div className={styles.loginBox}>
          <h2>Iniciar Sesión</h2>

          {/* Switch de usuario */}
          <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-4 shadow-sm">
            {["Alumno", "Profesor", "Administrador"].map((role) => (
              <li className="nav-item" key={role}>
                <button
                  className={`nav-link rounded-4 ${userType === role ? "active" : ""}`}
                  onClick={() => setUserType(role)}
                >
                  {role}
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            name="email"
            placeholder={"Correo"}
            className={styles.inputField}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className={styles.inputField}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            className={styles.blueButton}
            onClick={handleSignIn}
            disabled={loadingfirebase}
            type="submit"
          >
            {loadingfirebase ? "Cargando..." : "Acceder"}
          </button>

          <p className={styles.forgotPassword}>
            ¿Perdiste tu contraseña?
            <Link href="/Recuperar" className={styles.recoverLink}>Recuperar</Link>
          </p>
        </div>
      </div>

      <div className={styles.messageContainer}>
        {error && <div className={styles.errorBox}>{error}</div>}
        {alert && <div className={styles.alertBox}>{alert}</div>}
        {loadingfirebase && <div className={styles.loading}>Loaging</div>}

      </div>

    </div>
  );
};

export default Login;
