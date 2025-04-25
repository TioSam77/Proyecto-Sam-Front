'use client'

import { useState } from "react";
import styles from "../css/Login.module.css";
import countryList from "./countries.json";

const RegisterTeacher = () => {
    const [selectedCountry, setSelectedCountry] = useState("CR"); // CR es el código de Costa Rica
    const [phoneNumber, setPhoneNumber] = useState("");

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

    return (
        <section className={styles.loginContainer}>
            <form className={styles.boxWrapper}>
                <div className={styles.borderGradient}></div>
                
                <div className={styles.loginBox}>
                    <h2>Creación de Cuenta de Profesor(a)</h2>

                    <div className={styles.separator}>
                        <label>Correo Electrónico</label>
                        <input type="email" placeholder="profe@gmail.com" className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Contraseña</label>
                        <input type="password" placeholder="Contraseña" className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Confirmar Contraseña</label>
                        <input type="password" placeholder="Confirmar Contraseña" className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Nombres</label>
                        <input type="text" placeholder="Nombres" className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Apellidos</label>
                        <input type="text" placeholder="Apellidos" className={styles.inputField} />
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

                    <button className={styles.blueButton}>Crear Cuenta</button>

                    <p className={styles.register}>
                        ¿Ya tienes una cuenta?
                        <a href="/Login" className={styles.registerLink}>Inicia sesión</a>
                    </p>
                </div>
            </form>
        </section>
    );
};

export default RegisterTeacher;
