"use client";
import { useState } from "react";
import styles from "../css/Login.module.css";
import justifications from "../css/StudentJustification.module.css";

const StudentJustification = () => {
  const [justificationsList, setJustificationsList] = useState([
    { id: 1, student: "Paola", date: "2025-03-10", reason: "Enfermedad", status: "Pendiente" },
  ]);

  const [newJustification, setNewJustification] = useState({
    student: "",
    date: "",
    reason: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 200;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJustification({ ...newJustification, [name]: value });

    if (name === "reason") {
      setCharCount(value.length);
    }
  };

  const handleAddJustification = () => {
    if (newJustification.student && newJustification.date && newJustification.reason) {
      setJustificationsList([...justificationsList, { id: justificationsList.length + 1, ...newJustification, status: "Pendiente" }]);
      setNewJustification({ student: "", date: "", reason: "" });
      setCharCount(0);
      setShowForm(false);
    }
  };

  return (
    <section className={justifications.justificationTableContainer}>
      <h3 className={styles.welcomeText}>Justificación de Faltas</h3>
      <div className={justifications.borderGradient}></div> {/* Borde degradado */}

      <div className={justifications.box}>
        <table className={justifications.justificationTable}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Fecha</th>
              <th>Motivo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {justificationsList.map((justif) => (
              <tr key={justif.id}>
                <td>{justif.student}</td>
                <td>{justif.date}</td>
                <td>{justif.reason}</td>
                <td>{justif.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={justifications.addButton} onClick={() => setShowForm(!showForm)}>+</button>
      </div>

      {showForm && (
        <div className={justifications.formContainer}>
          <input type="text" name="student" placeholder="Nombre del Alumno" value={newJustification.student} onChange={handleInputChange} />
          <input type="date" name="date" value={newJustification.date} onChange={handleInputChange} />
          <textarea name="reason" placeholder="Motivo de la falta..." maxLength={charLimit} value={newJustification.reason} onChange={handleInputChange} />
          <p className={charCount > charLimit ? justifications.errorText : justifications.charCount}>{charCount}/{charLimit} caracteres</p>
          <button onClick={handleAddJustification} className={justifications.saveButton}>Agregar</button>
        </div>
      )}
    </section>
  );
};

export default StudentJustification;
