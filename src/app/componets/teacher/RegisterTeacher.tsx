'use client'

import { useEffect, useState } from "react";
import styles from "@/app/css/Login.module.css";
import countryList from "../countries.json";
import { auth, db } from "@/../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { updateProfile } from "firebase/auth";

const RegisterTeacher = () => {
    const [selectedCountry, setSelectedCountry] = useState("CR"); // CR es el código de Costa Rica
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const [error, setError] = useState<string>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [createUserWithEmailAndPassword, , loadingfirebase, firebaseError] = useCreateUserWithEmailAndPassword(auth);

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
                setError("Ocurrió un error al registrar el usuario. Intenta nuevamente.");
                break;
        }
    }, [firebaseError]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const cleanedInput = input.replace(/\D/g, "");
        setPhoneNumber(cleanedInput);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            const usercredential = await createUserWithEmailAndPassword(email, password);
            const newUser = usercredential?.user

            if (!newUser?.uid) {
                setError("No se pudo crear el usuario.");
                return;
            }

            await updateProfile(newUser, {
                displayName: `${name} ${surname}`,
            });

            const userData = {
                email: newUser.email,
                name: name,
                surname: surname,
                phoneNumber: `${countryCode} ${phoneNumber}`,
            }

            const docRef = doc(db, "teacher", newUser.uid);
            setDoc(docRef, userData)

            setAlert("Profesor registrado exitosamente.");
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

    const selectedCountryData = countryList.find(country => country.iso2 === selectedCountry);
    const countryCode = selectedCountryData ? `+${selectedCountryData.phoneCode}` : "";

    return (
        <section className={styles.loginContainer}>
            <form className={styles.boxWrapper} onSubmit={handleSubmit}>
                <div className={styles.borderGradient}></div>

                <div className={styles.loginBox}>
                    <h2>Creación de Cuenta de Empleado(a)</h2>

                    <div className={styles.separator}>
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="ejemplo@gmail.com"
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
                            placeholder="Nombres"
                            className={styles.inputField}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.separator}>
                        <label>Apellidos</label>
                        <input
                            type="text"
                            placeholder="Apellidos"
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
                                    width="10"
                                    height="10"
                                />
                                <span className={styles.countryCode}>{countryCode}</span>
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                className={styles.phoneInput}
                            />
                        </div>
                    </div>

                    <div className={styles.separator}>
                        <label>Materia(s) que imparte</label>
                        <input type="text" placeholder="Ej. Matemáticas, Física..." className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Nivel educativo que enseña</label>
                        <input type="text" placeholder="Ej. Secundaria, Universidad..." className={styles.inputField} />
                    </div>

                    <button className={styles.blueButton}
                        disabled={loadingfirebase}>
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

export default RegisterTeacher;
