import styles from "../css/Login.module.css";

const RecoverPassword = () => {

    return (
        <section className={styles.loginContainer}>
            <div className={styles.form}>
                <div className={styles.borderGradient}></div> {/* Borde degradado */}
                <div className={styles.loginBox}>
                <h2>Recuperar Contraseña</h2>

                <div className={styles.separator}>
                    <label>Tu nueva contraseña sera enviada al siguiente correo</label>
                    <h4>sam30@gmail.com</h4>
                </div>

                <button className={styles.blueButton}>Enviar nueva Contraseña</button>
                </div>
            </div>
        </section>
    )
}

export default RecoverPassword
