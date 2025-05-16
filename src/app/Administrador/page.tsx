import Record from "../componets/Record";
import DeleteSubjects from "./DeleteSubjects";
import EditGroup from "./EditGroup";
import EditStudent from "./EditStudent";
import EditTeacher from "./EditTeacher";
import RegisterAdmin from "./RegisterAdmin";

export default function Page() {
    return (
        <>
        <Record/>
        <DeleteSubjects/>
        <RegisterAdmin/>
        <EditStudent/>
        <EditTeacher/>
        <EditGroup/>
        </>
    )
}