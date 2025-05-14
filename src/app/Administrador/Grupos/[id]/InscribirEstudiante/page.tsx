import TableAddStudent from "@/app/componets/TableAddStudent"
import course from "@/app/css/Course.module.css"

export default function Page() {
    return (
        <section className={course.containerStudents}>
            <TableAddStudent />
        </section>
    )
}