'use client';

import { useState } from "react";
import styles from "@/app/css/RecoverPassword.module.css";

import Link from "next/link";
import { auth } from "../../../../firebase/clientApp";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const cleanedEmail = email.trim();

    if (!cleanedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, cleanedEmail);
      setMessage(`Se ha enviado un correo para restablecer la contraseña a ${cleanedEmail}.`);
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found") {
          setError("No hay ninguna cuenta con este correo.");
        } else {
          setError("Error al enviar el correo. Intenta nuevamente.");
        }
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Recuperar <br /> Contraseña</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
            className={styles.input}
          />

          <button type="submit" className={styles.blueButton}>
            Enviar nueva Contraseña
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <Link href="/Login" className={styles.link}>
          Volver a Iniciar Sesión
        </Link>
      </div>

    </div>
  );
};

export default RecoverPassword;
