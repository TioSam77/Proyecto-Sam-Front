'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../css/Login.module.css";


import { sendEmailVerification } from "firebase/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/../firebase/clientApp"
import { usePathname, useRouter } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/../firebase/clientApp";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  const [
    signInWithEmailAndPassword,
    firebaseUser,
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
    try {
      {
      // if (!user.emailVerified) {
      //   await sendEmailVerification(user);
      //   setAlert("Tu correo no está verificado. Te enviamos un correo de verificación.");
      //   return;
      // }
      }

      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential?.user;
      
      if (!user) return;

      router.push('/Alumno')
      
    } catch (err: any) {
      setError("Credenciales incorrectas o error en la autenticación.");
    }
  };


  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeText}>Bienvenido a Interactivo</h1>
      <div className={styles.boxWrapper}>
        <div className={styles.borderGradient}></div> {/* Borde degradado */}

        <div className={styles.loginBox}>
          <h2>Iniciar Sesión</h2>


          <input
            type="text"
            name="email"
            placeholder="correo"
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

          <button className={styles.blueButton} onClick={handleSignIn}>
            Acceder
          </button>

          <p className={styles.forgotPassword}>
            ¿Perdiste tu contraseña?
            <a href="/Recuperar" className={styles.recoverLink}>Recuperar</a>
          </p>
          <p className={styles.register}>
            ¿No tienes cuenta?
            <a href="/Registro" className={styles.registerLink}>Regístrate</a>
          </p>
        </div>
      </div>

      <div className={styles.messageContainer}>
        {error && <div className={styles.errorBox}>{error}</div>}
        {alert && <div className={styles.alertBox}>{alert}</div>}
      </div>

    </div>
  );
};

export default Login;
