import styleCourse from "../css/Course.module.css"

const MapCourse = () => {
    return (
        <section className={styleCourse.center}>
            <ol className={styleCourse.containerSubjects}>
                <li className={styleCourse.subjects}>
                    <div className={styleCourse.header}>
                        <a href="/Ingles">
                        <div className={styleCourse.image}></div>
                        <h2 className={styleCourse.textHeader}>Ingles</h2>
                        </a>
                    </div>
                    <div className={styleCourse.body}>
                        <h5>h</h5>
                    </div>
                    <div className={styleCourse.footer}>
                        <h5>h</h5>
                    </div>
                </li>

                <li className={styleCourse.subjects}>
                    <div className={styleCourse.header}>
                        <div className={styleCourse.image}></div>
                        <h2 className={styleCourse.textHeader}>Ingles</h2>
                    </div>
                    <div className={styleCourse.body}>
                        <h5>h</h5>
                    </div>
                    <div className={styleCourse.footer}>
                        <h5>h</h5>
                    </div>
                </li>

                <li className={styleCourse.subjects}>
                    <div className={styleCourse.header}>
                        <div className={styleCourse.image}></div>
                        <h2 className={styleCourse.textHeader}>Ingles</h2>
                    </div>
                    <div className={styleCourse.body}>
                        <h5>h</h5>
                    </div>
                    <div className={styleCourse.footer}>
                        <h5>h</h5>
                    </div>
                </li>

                <li className={styleCourse.subjects}>
                    <div className={styleCourse.header}>
                        <div className={styleCourse.image}></div>
                        <h2 className={styleCourse.textHeader}>Ingles</h2>
                    </div>
                    <div className={styleCourse.body}>
                        <h5>h</h5>
                    </div>
                    <div className={styleCourse.footer}>
                        <h5>h</h5>
                    </div>
                </li>
            </ol>
        </section>
    )
}

export default MapCourse