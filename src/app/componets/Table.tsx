import styles from "../css/Login.module.css";
import tables from "../css/Table.module.css"

const Table = () => {

    return (
        <section className={tables.TableContainer}>

            <h3 className={styles.welcomeText}>Asistencia Estudiantes</h3>
            <div className={styles.boxWrapper}>

                <div className={styles.borderGradient}></div> {/* Borde degradado */}

                <div className={tables.box}>
                    <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th className={tables.fixedCol}>Nombre</th>
                                <th>9-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                                <th>16-jul</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>67</td>
                                <td className={tables.fixedCol}>Paola</td>
                                <td>P</td>
                                <td>P</td>

                            </tr>

                            <tr>
                                <td>170</td>
                                <td className={tables.fixedCol}>Amelia</td>
                                <td>P</td>
                                <td>N</td>

                            </tr>

                            <tr>
                                <td>182</td>
                                <td className={tables.fixedCol}>Carolina</td>
                                <td>P</td>
                                <td>P</td>

                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Table;