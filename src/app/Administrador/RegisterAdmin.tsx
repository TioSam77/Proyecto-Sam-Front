'use client';

import { useEffect, useState } from "react";
import styles from "@/app/css/Login.module.css";
import { auth, db } from "@/../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";

const RegisterAdmin = () => {
  const [selectedCountry, setSelectedCountry] = useState("CR");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [error, setError] = useState<string | null>("");
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [createUserWithEmailAndPassword, , loadingfirebase, firebaseError] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (!firebaseError?.message) return;

    const message = firebaseError.message;
    const errorCode = message.match(/auth\/[a-zA-Z0-9-_]+/)?.[0];

    const errorMap: { [key: string]: string } = {
      "auth/email-already-in-use": "Ese correo ya está registrado.",
      "auth/invalid-email": "Ese correo es inválido.",
      "auth/weak-password": "La contraseña es muy débil. Usa al menos 6 caracteres.",
      "auth/missing-password": "La contraseña es obligatoria.",
      "auth/operation-not-allowed": "La creación de cuentas está deshabilitada temporalmente.",
      "auth/too-many-requests": "Demasiados intentos fallidos. Intenta de nuevo más tarde.",
    };

    setError(errorMap[errorCode || ""] || "Ocurrió un error al registrar el usuario. Intenta nuevamente.");
  }, [firebaseError]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    if (!alert) return;
    const timeout = setTimeout(() => setAlert(""), 4000);
    return () => clearTimeout(timeout);
  }, [alert]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedInput = e.target.value.replace(/\D/g, "");
    setPhoneNumber(cleanedInput);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential?.user;

      if (!user?.uid) {
        setError("No se pudo crear el usuario.");
        return;
      }

      const userData = {
        email,
        name,
        surname,
        role: "admin",
      };

      const docRef = doc(db, "admin", user.uid);
      await setDoc(docRef, userData);

      setAlert("Administrador creado exitosamente.");
      setEmail("");
      setName("");
      setSurname("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.loginContainer}>
      <form className={styles.boxWrapper} onSubmit={handleSubmit}>
        <div className={styles.borderGradient}></div>

        <div className={styles.loginBox}>
          <h2>Creación de Cuenta de Administrador</h2>

          <div className={styles.separator}>
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="admin@instituto.com"
              className={styles.inputField}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.separator}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.separator}>
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              className={styles.inputField}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className={styles.separator}>
            <label>Nombres</label>
            <input
              type="text"
              placeholder="Tus Nombres"
              className={styles.inputField}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className={styles.separator}>
            <label>Apellidos</label>
            <input
              type="text"
              placeholder="Tus Apellidos"
              className={styles.inputField}
              value={surname}
              onChange={e => setSurname(e.target.value)}
            />
          </div>

          <button className={styles.blueButton} disabled={loadingfirebase}>
            {loadingfirebase ? "Cargando..." : "Crear"}
          </button>

          <p className={styles.register}>
            ¿Ya tienes cuenta?
            <a href="/Login" className={styles.registerLink}>Logearte</a>
          </p>
        </div>
      </form>

      <div className={styles.messageContainer}>
        {error && <div className={styles.errorBox}>{error}</div>}
        {alert && <div className={styles.alertBox}>{alert}</div>}
        {loading && <div className={styles.loading}>Cargando...</div>}
      </div>
    </section>
  );
};

export default RegisterAdmin;
