"use client";

import React, { useState } from "react";
import styles from "../css/Login.module.css";

const Login = () => {
  const [userType, setUserType] = useState("Alumno"); // Estado para el switch

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeText}>Bienvenido a Interactivo</h1>
      <div className={styles.boxWrapper}>
        <div className={styles.borderGradient}></div> {/* Borde degradado */}

        <div className={styles.loginBox}>
          <h2>Iniciar Sesión</h2>

          {/* Switch de Bootstrap */}
          <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-4 shadow-sm" id="pillNav2" role="tablist">
            {["Alumno", "Profesor", "Administrador"].map((role) => (
              <li className="nav-item" role="presentation" key={role}>
                <button
                  className={`nav-link rounded-4 ${userType === role ? "active" : "inactive-switch"}`}
                  type="button"
                  role="tab"
                  aria-selected={userType === role}
                  onClick={() => setUserType(role)}
                >
                  {role}
                </button>
              </li>
            ))}
          </ul>

          {/* Inputs dinámicos según el usuario seleccionado */}
          <input
            type="text"
            placeholder={userType === "Alumno" ? "Número de cuenta" : userType === "Profesor" ? "RFC" : "Usuario"}
            className={styles.inputField}
          />
          <input type="password" placeholder="Contraseña" className={styles.inputField} />

          <button className={styles.blueButton}>Acceder</button>
          <p className={styles.forgotPassword}>
            ¿Perdiste tu contraseña?
            <a href="/Recuperar" className={styles.recoverLink}>Recuperar</a>
          </p>
          <p className={styles.register}>
            ¿No tienes cuenta?
            <a href="/Registro" className={styles.registerLink}>Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;