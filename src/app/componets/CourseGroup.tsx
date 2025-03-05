import styles from "../css/Login.module.css"
import style from "../css/group.module.css"

const CourseGroup = () => {
    return (
        <section className={style.sectionGroup}>

            <div className={style.group}>
                <div className={styles.borderGradient}></div>

                <h1>Ingles 2B</h1>
                <h1>c36</h1>
            </div>

            <div className={style.group}>
                <div className={styles.borderGradient}></div>

                <h1>Ingles 2C</h1>
                <h1>c35</h1>
            </div>

            <div className={style.group}>
                <div className={styles.borderGradient}></div>

                <h1>Ingles 2B</h1>
                <h1>c90</h1>
            </div>
            <div className={style.group}>
                <div className={styles.borderGradient}></div>

                <h1>Ingles 2B</h1>
                <h1>c90</h1>
            </div>

        </section>
    )
}

export default CourseGroup