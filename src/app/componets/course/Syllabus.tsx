"use client"
import { useEffect, useState } from "react"
import table from "@/app/css/Table.module.css"
import styles from "@/app/css/Syllabus.module.css" // Usa Binnacle o tu nuevo CSS
import { useParams } from "next/navigation"
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  addDoc,
  updateDoc
} from "firebase/firestore"
import { db } from '@/../firebase/clientApp';

interface SyllabusItem {
  id: string;
  day: string;
  topic: string;
  objectives: string;
  materials: string;
}

const Syllabus = () => {
  const params = useParams()
  const courseId = params?.id as string

  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>([])
  const [isFormVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    day: "",
    topic: "",
    objectives: "",
    materials: ""
  })

  const fetchSyllabus = async () => {
    try {
      const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/get-syllabus/${courseId}`);
      if (!res.ok) throw new Error("Error al obtener el syllabus");

      const data: SyllabusItem[] = await res.json();
      setSyllabusList(data);
    } catch (error) {
      console.error("Error al obtener el syllabus:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreateSyllabus = async () => {
    try {
      const res = await fetch('https://api-uj4mkoe42a-uc.a.run.app/post-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, id_course: courseId }),
      });

      if (!res.ok) throw new Error('Error al crear syllabus');

      // Limpiar estado
      setForm({ day: '', topic: '', objectives: '', materials: '' });
      setFormVisible(false);
      fetchSyllabus();
    } catch (err) {
      console.error('Error al crear syllabus:', err);
    }
  };

  const handleEditSyllabus = async () => {
    try {
      const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/put-syllabus/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, id: editId }),
      });

      if (!res.ok) throw new Error('Error al editar syllabus');

      setForm({ day: '', topic: '', objectives: '', materials: '' });
      setEditId(null);
      setFormVisible(false);
      fetchSyllabus();
    } catch (err) {
      console.error('Error al editar syllabus:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      handleEditSyllabus();
    } else {
      handleCreateSyllabus();
    }
  };

  const handleEdit = (item: SyllabusItem) => {
    setForm({
      day: item.day,
      topic: item.topic,
      objectives: item.objectives,
      materials: item.materials
    })
    setEditId(item.id)
    setFormVisible(true)
  }

  const deleteSyllabus = async (id: string) => {
    try {
      const res = await fetch(`https://api-uj4mkoe42a-uc.a.run.app/delete-syllabus/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el syllabus");
      }

      fetchSyllabus(); // Recargar la lista tras borrar
    } catch (error) {
      console.error("Error al eliminar el syllabus:", error);
    }
  };

  useEffect(() => {
    if (courseId) fetchSyllabus()
  }, [courseId])

  return (
    <section className={table.TableContainer}>

      <button className='bluebutton' onClick={() => {
        setFormVisible(true)
        setEditId(null)
        setForm({ day: "", topic: "", objectives: "", materials: "" })
      }}>
        Agregar Tema del dia
      </button>

      <h2 className="welcomeText">Lista de Temario</h2>
      <div className={table.box}>
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>Tema</th>
              <th>Objetivos</th>
              <th>Materiales</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {syllabusList.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                  No hay registros disponibles.
                </td>
              </tr>
            ) : (
              syllabusList.map(item => (
                <tr key={item.id}>
                  <td>{item.day}</td>
                  <td>{item.topic}</td>
                  <td>{item.objectives}</td>
                  <td>{item.materials}</td>
                  <td style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    <button className={styles.blueButton} onClick={() => handleEdit(item)}>Modificar</button>
                    <button className={styles.redButton} onClick={() => deleteSyllabus(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3>{editId ? 'Modificar Temario' : 'Crear Temario'}</h3>
            <form onSubmit={handleSubmit} className={styles.classList}>
              <input
                type="date"
                name="day"
                value={form.day}
                onChange={handleChange}
                className={styles.select}
                required
              />
              <input
                type="text"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="Tema"
                className={styles.select}
                required
              />
              <textarea
                name="objectives"
                value={form.objectives}
                onChange={handleChange}
                placeholder="Objetivos"
                className={styles.select}
              />
              <textarea
                name="materials"
                value={form.materials}
                onChange={handleChange}
                placeholder="Materiales"
                className={styles.select}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" className={styles.blueButton}>
                  {editId ? 'Guardar Cambios' : 'Guardar'}
                </button>
                <button type="button" className={styles.redButton}
                  onClick={() => {
                    setFormVisible(false)
                    setEditId(null)
                  }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Syllabus
