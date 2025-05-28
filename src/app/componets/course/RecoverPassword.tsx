'use client'
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import styles from "@/app/css/Login.module.css";
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
            await sendPasswordResetEmail(auth, email);
            setMessage(`Se ha enviado un correo para restablecer la contraseña a ${email}`);
        } catch (err) {
            setError("Error al enviar el correo. Verifica que el correo sea correcto.");
            console.error(err);
        }
    };

    return (
        <section className={styles.loginContainer}>
            <div className={styles.boxWrapper}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}
                <div className={styles.loginBox}>
                    <h2>Recuperar Contraseña</h2>

                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Introduce tu correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            required
                        />

                        <button type="submit" className={styles.blueButton}>
                            Enviar nueva Contraseña
                        </button>
                    </form>

                    {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
                    {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

                    <p className={styles.register}>
                        <Link href="/Login" className={styles.registerLink}>
                            Logearte
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RecoverPassword;
