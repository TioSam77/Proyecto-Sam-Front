import TableAddStudent from "@/app/componets/TableAddStudent"
import style from "@/app/css/Teacher.module.css"

export default function Page() {
    return (
        <section className={style.infoHead}>
            <TableAddStudent />
        </section>
    )
}