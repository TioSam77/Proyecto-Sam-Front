'use client'

import { useState } from "react";
import styles from "../css/Login.module.css";
import countryList from "./countries.json";

const Register = () => {
    const [selectedCountry, setSelectedCountry] = useState("CR"); // CR es el código de Costa Rica
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value);
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo permite números en el input
        const input = e.target.value;
        const cleanedInput = input.replace(/\D/g, ""); // Elimina cualquier carácter no numérico
        setPhoneNumber(cleanedInput);
    };

    // Buscar el código de país seleccionado
    const selectedCountryData = countryList.find(country => country.iso2 === selectedCountry);
    const countryCode = selectedCountryData ? `+${selectedCountryData.phoneCode}` : "";

    return (
        <section className={styles.loginContainer}>

            <form className={styles.boxWrapper}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}
                
                <div className={styles.loginBox}>
                    <h2>Creacion de Cuenta de Alumno</h2>

                    <div className={styles.separator}>
                        <label>Correo Electronico</label>
                        <input type="email" placeholder="Tu@gmail.com"
                            className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Contraseña</label>
                        <input type="password" placeholder="Contraseña"
                            className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Confirmar Contraseña</label>
                        <input type="password" placeholder="Confirmar Contrasena"
                            className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Nombres</label>
                        <input type="text" placeholder="Tus Nombres"
                            className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>Apellidos</label>
                        <input type="text" placeholder=" Tus Apellidos"
                            className={styles.inputField} />
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
                        <label>¿Hay algo que su profesor(a) debería saber?</label>
                        <input type="text"
                            className={styles.inputField} />
                    </div>

                    <div className={styles.separator}>
                        <label>¿Cómo escuchó de nosotros?</label>
                        <input type="text"
                            className={styles.inputField} />
                    </div>

                    <button className={styles.blueButton}>Crear</button>

                    <p className={styles.register}>
                        ¿Ya tienes cuenta?
                        <a href="/Login" className={styles.registerLink}>Logearte</a>
                    </p>
                </div>
            </form>
        </section>
    );
};

export default Register;
