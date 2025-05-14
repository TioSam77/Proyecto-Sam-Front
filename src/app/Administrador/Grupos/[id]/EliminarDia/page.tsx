import DeleteSchedule from "@/app/componets/DeleteSchedule"
import style from "@/app/css/Teacher.module.css"

export default function Page() {
    return (
        <section className={style.infoHead}>
            <DeleteSchedule />
        </section>
    )
}