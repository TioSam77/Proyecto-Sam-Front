import React from "react";
import styles from "../css/Login.module.css";

const Login = () => {
  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeText}>Bienvenido a Interactivo</h1>
      <div className={styles.boxWrapper}>
        <div className={styles.borderGradient}></div> {/* Borde degradado */}
        <div className={styles.loginBox}>
          <h2>Iniciar Sesión</h2>
          <input type="text" placeholder="Usuario" className={styles.inputField} />
          <input type="password" placeholder="Contraseña" className={styles.inputField} />
          <button className={styles.loginButton}>Acceder</button>
          <p className={styles.forgotPassword}>¿Perdiste tu contraseña?</p>
          <p className={styles.register}>
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;