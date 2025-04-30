import MapStudent from "@/app/componets/student/MapStudent";
import TableAddStudent from "@/app/componets/TableAddStudent";
import TableStudent from "@/app/componets/TableStudents";
import course from "@/app/css/Course.module.css"

export default function Page() {
    return (
        <>
            <div className={course.containerStudents}>

                <TableAddStudent apiUrl="" />
                <TableStudent apiUrl="" />
                
            </div>
        </>
    )
}