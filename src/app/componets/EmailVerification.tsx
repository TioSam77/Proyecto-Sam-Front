"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";

export default function EmailVerificationChecker() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // Refresca el estado del usuario
        if (!user.emailVerified) {
          try {
            await sendEmailVerification(user);
            setMessage("Tu correo no está verificado. Se ha enviado un correo de verificación.");
          } catch (error) {
            setMessage("Error al enviar el correo de verificación.");
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return message ? (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
      {message}
    </div>
  ) : null;
}
