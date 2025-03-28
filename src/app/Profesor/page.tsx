
import MapCourse from "../componets/MapCourse";
import HeaderProfesor from "./HeaderProfesor";


export default function Page() {
  return (
    <>
    <HeaderProfesor />
    <section className="containerSection">
      <MapCourse />
    </section>
    </>
  )
}