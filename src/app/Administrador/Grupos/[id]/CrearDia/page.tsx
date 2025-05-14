import CreateSchedule from "@/app/componets/CreateSchedule"
import style from "@/app/css/Teacher.module.css"

export default function Page() {
    return (
        <section className={style.infoHead}>
            <CreateSchedule />
        </section>
    )
}