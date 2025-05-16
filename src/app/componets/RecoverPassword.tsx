import styles from "../css/Login.module.css";

const RecoverPassword = () => {

    return (
        <section className={styles.loginContainer}>
            
            <div className={styles.boxWrapper}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}
                <div className={styles.loginBox}>
                    <h2>Recuperar Contraseña</h2>

                    <div className={styles.separator}>
                        <label>Tu nueva contraseña sera enviada al siguiente correo</label>
                        <h4>sam30@gmail.com</h4>
                    </div>

                    <button className={styles.blueButton}>Enviar nueva Contraseña</button>

                    <p className={styles.register}>
                        <a href="/Login" className={styles.registerLink}>Logearte</a>
                    </p>

                </div>
            </div>
        </section>
    )
}

export default RecoverPassword
