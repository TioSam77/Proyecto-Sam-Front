'use client';

import { useState } from "react";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import styles from "@/app/css/RecoverPassword.module.css";
import { auth } from "../../../../firebase/clientApp";
import Link from "next/link";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setError("Este correo no está registrado o no ha sido verificado.");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setMessage(`Se ha enviado un correo para restablecer la contraseña a ${email}. Verifica tu bandeja de entrada.`);
    } catch (err) {
      setError("Error al enviar el correo. Verifica que el correo sea correcto.");
      console.error(err);
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

      <footer className={styles.footer}>© 2025 Interactivo</footer>
    </div>
  );
};

export default RecoverPassword;
