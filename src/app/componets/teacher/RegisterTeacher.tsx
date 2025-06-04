'use client'

import { useEffect, useState } from "react";
import styles from "@/app/css/Login.module.css";
import countryList from "@/app/data/countries.json";
import Image from "next/image";
import { envCredentials } from "../../../../firebase/envConfigurations";

const RegisterTeacher = () => {
    const [selectedCountry, setSelectedCountry] = useState("CR"); // CR es el código de Costa Rica
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const [puesto, setPuesto] = useState("");
    const [rol, setRol] = useState(3); // valor por defecto 2 = Administrador

    const [error, setError] = useState<string>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { api } = envCredentials();


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
        setError("");
        setAlert("");

        const [firstName, secondName = ""] = name.trim().split(" ");
        const [firstSurname, secondSurname = ""] = surname.trim().split(" ");


        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!email || !password || !name || !surname) {
            setError("Por favor llena todos los campos requeridos.");
            return;
        }

        if (![2, 3].includes(rol)) {
            setError("Selecciona un rol válido.");
            return;
        }

        setLoading(true);

        try {
            const countryCode = countryList.find(c => c.iso2 === selectedCountry)?.phoneCode || "";

            const res = await fetch(`${api}/register-employee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name: `${firstName}`.trim(),
                    name2: `${secondName}`.trim(),
                    surname: `${firstSurname}`.trim(),
                    surname2: `${secondSurname}`.trim(),
                    phoneNumber: `+${countryCode} ${phoneNumber}`,
                    puesto,
                    rol,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error al crear el empleado.");
            } else {
                setAlert("Empleado registrado exitosamente.");
                // Limpiar formulario
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setName("");
                setSurname("");
                setPhoneNumber("");
                setPuesto("");
                setRol(3);
            }
        } catch (err) {
            setError(`Error de red o servidor. ${err}`);
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
                        <label>Puesto</label>
                        <input
                            type="text"
                            placeholder="Ej. Gerente"
                            className={styles.inputField}
                            value={puesto}
                            onChange={e => setPuesto(e.target.value)}
                        />
                    </div>

                    {/* NUEVO selector Rol */}
                    <div className={styles.separator}>
                        <label>Rol</label>
                        <select
                            className={styles.inputField}
                            value={rol}
                            onChange={e => setRol(Number(e.target.value))}
                        >
                            <option value={2}>Administrador</option>
                            <option value={3}>Profesor Inglés</option>
                        </select>
                    </div>

                    <button className={styles.blueButton}
                        disabled={loading}>
                        {loading ? "Cargando..." : "Crear"}
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
