import styles from "../css/Login.module.css"
import style from "../css/group.module.css"

const CourseGroup = () => {
    return (
        <section className={style.sectionGroup}>

            <div className={style.group}>

                <h2>Ingles 2B</h2>
                <h2>c36</h2>
            </div>

            <div className={style.group}>

                <h2>Ingles 2C</h2>
                <h2>c35</h2>
            </div>

            <div className={style.group}>

                <h2>Ingles 2B</h2>
                <h2>c90</h2>
            </div>
            <div className={style.group}>

                <h2>Ingles 2B</h2>
                <h2>c90</h2>
            </div>

        </section>
    )
}

export default CourseGroup