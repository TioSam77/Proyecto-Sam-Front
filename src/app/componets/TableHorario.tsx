
import tables from "../css/Table.module.css";
import styles from "../css/Login.module.css";


const TableHorario = ()=>{
    return(
<section className={tables.TableContainer}>
      <div className={tables.box}>
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
              <tr >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
          </tbody>
        </table>
      </div>
    </section>
    )
}

export default TableHorario