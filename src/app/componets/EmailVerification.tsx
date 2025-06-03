"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import styles from "../css/EmailVerification.module.css";

export default function EmailVerificationChecker() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (!user.emailVerified) {
          try {
            await sendEmailVerification(user);
            setMessage(
              "Tu correo no está verificado. Se ha enviado un correo de verificación."
            );
          } catch (error) {
            setMessage(`Error al enviar el correo de verificación. ${error}`);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!message || !show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <button
          onClick={() => setShow(false)}
          className={styles.closeButton}
          aria-label="Cerrar"
        >
          ✕
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}
