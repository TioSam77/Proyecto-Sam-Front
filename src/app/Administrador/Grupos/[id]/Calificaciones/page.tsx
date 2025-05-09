
import TableCourseFinalGrade from "@/app/componets/course/TableCourseFinalGrade";
import style from "@/app/css/Login.module.css"

export default function Page() {
    return (
        <>
            <h3 className={style.welcomeText}>Calificaciones de estudiantes</h3>
            <TableCourseFinalGrade apiUrl="" />
        </>
    )
}