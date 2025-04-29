import styleCourse from "@/app/css/Course.module.css"

const ViewGroup = () => {
    return (
    <section className={styleCourse.viewHeader}>
        <div className={styleCourse.header}>
            <div className={styleCourse.image}></div>
            <h1 className={styleCourse.textHeader}>Inglés</h1>
        </div>
    </section>
    )
}

export default ViewGroup;