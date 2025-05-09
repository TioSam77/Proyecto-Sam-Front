
import TableAddStudent from "@/app/componets/TableAddStudent";
import TableStudent from "@/app/componets/student/TableStudents";
import course from "@/app/css/Course.module.css"

export default function Page() {
    return (
        <>
            <div className={course.containerStudents}>

                <TableAddStudent />
                <TableStudent />
                
            </div>
        </>
    )
}