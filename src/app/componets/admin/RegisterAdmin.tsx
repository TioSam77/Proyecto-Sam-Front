'use client'

import { useEffect, useState } from "react";
import styles from "@/app/css/Login.module.css";
import countryList from "@/app/data/countries.json";
import { auth, db } from "@/../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { updateProfile } from "firebase/auth";

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

  const [createUserWithEmailAndPassword, , loadingfirebase, firebaseError] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (!firebaseError?.message) return;

    const message = firebaseError.message;
    const errorCode = message.match(/auth\/[a-zA-Z0-9-_]+/)?.[0];

    switch (errorCode) {
      case "auth/email-already-in-use":
        setError("Ese correo ya está registrado.");
        break;
      case "auth/invalid-email":
        setError("Ese correo es inválido.");
        break;
      case "auth/weak-password":
        setError("La contraseña es muy débil. Usa al menos 6 caracteres.");
        break;
      default:
        setError("Ocurrió un error al registrar el usuario. Intenta nuevamente.");
        break;
    }
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
    const input = e.target.value;
    const cleanedInput = input.replace(/\D/g, "");
    setPhoneNumber(cleanedInput);
  };

  const selectedCountryData = countryList.find(country => country.iso2 === selectedCountry);
  const countryCode = selectedCountryData ? `+${selectedCountryData.phoneCode}` : "";

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

      await updateProfile(user, {
        displayName: `${name} ${surname}`,
      });

      const userData = {
        email,
        name,
        surname,
        phoneNumber: `${countryCode} ${phoneNumber}`,
        role: "2"
      };

      const docRef = doc(db, "admin", user.uid);
      await setDoc(docRef, userData);

      setAlert("Administrador registrado exitosamente.");
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
          <h2>Creación de Cuenta de Admin</h2>

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

          <div className={styles.separator}>
            <label>Teléfono</label>
            <div className={styles.inputField} style={{ display: 'flex' }}>
              <div className={styles.countrySelector}>
                <select
                  className={styles.PhoneInputSelect}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  style={{ borderWidth: "0" }}
                >
                  {countryList.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.nameES}
                    </option>
                  ))}
                </select>
                <Image
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry}.svg`}
                  alt={selectedCountry}
                  className={styles.flagIcon}
                  height="10"
                  width="10"
                />
                <span className={styles.countryCode}>{countryCode}</span>
              </div>
              <input
                type="tel"
                className={styles.phoneInput}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
          </div>

          <button className={styles.blueButton} disabled={loadingfirebase}>
            {loadingfirebase ? "Cargando..." : "Crear"}
          </button>

        </div>
      </form>

      <div className={styles.messageContainer}>
        {error && <div className={styles.errorBox}>{error}</div>}
        {alert && <div className={styles.alertBox}>{alert}</div>}
        {loading && <div className={styles.loading}>loading</div>}
      </div>

    </section>
  );
};

export default RegisterAdmin;
