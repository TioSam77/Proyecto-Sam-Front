import React, { Dispatch, SetStateAction } from "react";
import styles from "../css/Login.module.css";

export const fakeUsers: Record<"Alumno" | "Profesor" | "Administrador", { username: string; password: string; redirect: string }> = {
  Alumno: { username: "20231234", password: "123456", redirect: "/alumno" },
  Profesor: { username: "RFC123", password: "profesor123", redirect: "/profesor" },
  Administrador: { username: "admin", password: "admin123", redirect: "/admin" },
};

interface LoginProps {
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
  credentials: { username: string; password: string };
  setCredentials: Dispatch<SetStateAction<{ username: string; password: string }>>;
  error: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({
  userType,
  setUserType,
  credentials,
  setCredentials,
  error,
  handleInputChange,
  handleLogin
}) => {
  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.welcomeText}>Bienvenido a Interactivo</h1>
      <div className={styles.boxWrapper}>
        <div className={styles.borderGradient}></div> {/* Borde degradado */}

        <div className={styles.loginBox}>
          <h2>Iniciar Sesión</h2>

          {/* Switch de usuario */}
          <ul className="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-4 shadow-sm">
            {["Alumno", "Profesor", "Administrador"].map((role) => (
              <li className="nav-item" key={role}>
                <button
                  className={`nav-link rounded-4 ${userType === role ? "active" : ""}`}
                  onClick={() => setUserType(role)}
                >
                  {role}
                </button>
              </li>
            ))}
          </ul>

          {/* Inputs de usuario */}
          <input
            type="text"
            name="username"
            placeholder={userType === "Alumno" ? "Número de cuenta" : userType === "Profesor" ? "RFC" : "Usuario"}
            className={styles.inputField}
            value={credentials.username}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className={styles.inputField}
            value={credentials.password}
            onChange={handleInputChange}
          />

          {error && <p className={styles.errorText}>{error}</p>} {/* Mostrar error si hay */}

          <button className={styles.blueButton} onClick={handleLogin}>
            Acceder
          </button>

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
