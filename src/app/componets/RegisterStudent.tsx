'use client'

import { useEffect, useState } from "react";
import styles from "../css/Login.module.css";
import countryList from "./countries.json";
import { auth } from "@/../firebase/clientApp";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { getDatabase, ref, set } from "firebase/database";

const RegisterStudent = () => {
    const [selectedCountry, setSelectedCountry] = useState("CR"); // CR es el código de Costa Rica
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [teacherNote, setTeacherNote] = useState("");
    const [heardFrom, setHeardFrom] = useState("");

    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");

    const [loading, setLoading] = useState(false);

    const [createUserWithEmailAndPassword, user, loadingfirebase, firebaseError] = useCreateUserWithEmailAndPassword(auth);

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
        const cleanedInput = input.replace(/\D/g, ""); // Elimina cualquier carácter no numérico
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
            const user = usercredential?.user

            if (!user) return;

            const db = getDatabase();
            await set(ref(db, `students/${user.uid}`), {
                uid: user.uid,
                email: user.email,
                nombres: name,
                apellidos: surname,
                telefono: `${countryCode}${phoneNumber}`,
                notaProfesor: teacherNote,
                escuchoDe: heardFrom
            });


            setAlert("Alumno registrado exitosamente.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Buscar el código de país seleccionado
    const selectedCountryData = countryList.find(country => country.iso2 === selectedCountry);
    const countryCode = selectedCountryData ? `+${selectedCountryData.phoneCode}` : "";

    return (
        <section className={styles.loginContainer}>

            <form className={styles.boxWrapper} onSubmit={handleSubmit}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}

                <div className={styles.loginBox}>
                    <h2>Creacion de Cuenta de Alumno</h2>

                    <div className={styles.separator}>
                        <label>Correo Electronico</label>
                        <input
                            type="email"
                            placeholder="Tu@gmail.com"
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
                            placeholder="Confirmar Contrasena"
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
                            placeholder=" Tus Apellidos"
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
                                <img
                                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry}.svg`}
                                    alt={selectedCountry}
                                    className={styles.flagIcon}
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
                    <div className={styles.separator}>
                        <label>¿Hay algo que su profesor(a) debería saber?</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={teacherNote}
                            onChange={e => setTeacherNote(e.target.value)}
                        />
                    </div>

                    <div className={styles.separator}>
                        <label>¿Cómo escuchó de nosotros?</label>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={heardFrom}
                            onChange={e => setHeardFrom(e.target.value)}
                        />
                    </div>

                    <button className={styles.blueButton}>Crear</button>

                    <p className={styles.register}>
                        ¿Ya tienes cuenta?
                        <a href="/Login" className={styles.registerLink}>Logearte</a>
                    </p>
                </div>
            </form>

            <div className={styles.messageContainer}>
                {error && <div className={styles.errorBox}>{error}</div>}
                {alert && <div className={styles.alertBox}>{alert}</div>}
            </div>


        </section>
    );
};

export default RegisterStudent;
