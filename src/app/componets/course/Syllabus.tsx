import table from "../css/Table.module.css"

const Syllabus =()=>{
    return(
        <section className={table.box}>
        <table>
            <thead>
                <tr>
                    <th>Semana</th>
                    <th>Tema</th>
                    <th>Objetivos</th>
                    <th>Materiales</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Introducción al curso</td>
                    <td>Presentar la asignatura y objetivos</td>
                    <td>Presentaciones, guías</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Fundamentos básicos</td>
                    <td>Comprender los conceptos clave</td>
                    <td>Libros, diapositivas</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Aplicaciones prácticas</td>
                    <td>Ejercicios y análisis de casos</td>
                    <td>Casos de estudio, ejercicios</td>
                </tr>
            </tbody>
        </table>
    </section>
    )
}

export default Syllabus