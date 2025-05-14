
import style from "@/app/css/Teacher.module.css"
import TableAttendance from "@/app/componets/course/TableAttendance"

export default function Page() {

    return (
        <>
            <section className={style.infoHead}>
                <TableAttendance />
            </section>
        </>
    )
}