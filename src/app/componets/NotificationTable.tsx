"use client";
import { useState } from "react";
import tables from "../css/Table.module.css";
import styles from "../css/Login.module.css";
import notifications from "../css/NotificationTable.module.css";

const NotificationTable = () => {
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: "Examen parcial", startDate: "2025-03-10", endDate: "2025-03-12", message: "El examen será el 10 de marzo a las 9:00 AM." },
  ]);
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    startDate: "",
    endDate: "",
    message: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const charLimit = 200;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNotification({ ...newNotification, [name]: value });

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleAddNotification = () => {
    if (newNotification.title && newNotification.startDate && newNotification.endDate && newNotification.message) {
      setNotificationsList([...notificationsList, { id: notificationsList.length + 1, ...newNotification }]);
      setNewNotification({ title: "", startDate: "", endDate: "", message: "" });
      setCharCount(0);
      setShowForm(false);
    }
  };

  return (
    <section className={tables.TableContainer}>
      <h3 className={styles.welcomeText}>Notificaciones</h3>
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
            {notificationsList.map((notif) => (
              <tr key={notif.id}>
                <td>{notif.title}</td>
                <td>{notif.startDate}</td>
                <td>{notif.endDate}</td>
                <td>{notif.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={notifications.addButton} onClick={() => setShowForm(!showForm)}>+</button>
      </div>

      {showForm && (
        <div className={notifications.formContainer}>
          <input type="text" name="title" placeholder="Título" value={newNotification.title} onChange={handleInputChange} />
          <input type="date" name="startDate" value={newNotification.startDate} onChange={handleInputChange} />
          <input type="date" name="endDate" value={newNotification.endDate} onChange={handleInputChange} />
          <textarea name="message" placeholder="Introduce el mensaje..." maxLength={charLimit} value={newNotification.message} onChange={handleInputChange} />
          <p className={charCount > charLimit ? notifications.errorText : notifications.charCount}>{charCount}/{charLimit} caracteres</p>
          <button onClick={handleAddNotification}>Agregar</button>
        </div>
      )}
    </section>
  );
};

export default NotificationTable;
