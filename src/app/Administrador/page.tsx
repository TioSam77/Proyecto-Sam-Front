import Record from "../componets/Record";
import EditSchedule from "../componets/course/EditSchedule";
import EditProfile from "./EditProfile";

export default function Page() {
    return (
        <>
            <Record />
            <EditSchedule/>
            <EditProfile role="admin"/>
        </>

    )
}