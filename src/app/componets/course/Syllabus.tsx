"use client"
import { useEffect, useState } from "react"
import table from "@/app/css/Table.module.css"
import styles from "@/app/css/form.module.css"
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

const Syllabus = () => {
  const params = useParams()
  const courseId = params?.id as string

  const [syllabusList, setSyllabusList] = useState<any[]>([])
  const [isFormVisible, setFormVisible] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [form, setForm] = useState({
    day: "",
    topic: "",
    objectives: "",
    materials: ""
  })

  const fetchSyllabus = async () => {
    const q = query(collection(db, "Syllabus"), where("id_course", "==", courseId))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setSyllabusList(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editId) {
      const ref = doc(db, "Syllabus", editId)
      await updateDoc(ref, form)
    } else {
      await addDoc(collection(db, "Syllabus"), {
        ...form,
        id_course: courseId
      })
    }

    setForm({ day: "", topic: "", objectives: "", materials: "" })
    setEditId(null)
    setFormVisible(false)
    fetchSyllabus()
  }

  interface ItemProps {
    id: string;        
    day: string;
    topic: string;
    objectives: string;
    materials: string;    
  }

  const handleEdit = (item: ItemProps) => {
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
    await deleteDoc(doc(db, "Syllabus", id))
    fetchSyllabus()
  }

  useEffect(() => {
    if (courseId) fetchSyllabus()
  }, [courseId])

  return (
    <section className={table.box}>
      <button onClick={() => { setFormVisible(true); setEditId(null); setForm({ day: "", topic: "", objectives: "", materials: "" }) }}>
        Crear syllabus
      </button>

      <table>
        <thead>
          <tr>
            <th>Día</th>
            <th>Tema</th>
            <th>Objetivos</th>
            <th>Materiales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {syllabusList.length === 0 ? (
            <tr>
              <td colSpan={5}>No hay registros.</td>
            </tr>
          ) : (
            syllabusList.map(item => (
              <tr key={item.id}>
                <td>{item.day}</td>
                <td>{item.topic}</td>
                <td>{item.objectives}</td>
                <td>{item.materials}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Modificar</button>
                  <button onClick={() => deleteSyllabus(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isFormVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3>{editId ? 'Modificar Syllabus' : 'Crear Syllabus'}</h3>
            <form onSubmit={handleSubmit} className={styles.classList}>
              <input
                type="number"
                name="day"
                value={form.day}
                onChange={handleChange}
                placeholder="Día"
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
                maxLength={60}
              />
              <textarea
                name="objectives"
                value={form.objectives}
                onChange={handleChange}
                placeholder="Objetivos"
                className={styles.select}
                maxLength={200}
              />
              <textarea
                name="materials"
                value={form.materials}
                onChange={handleChange}
                placeholder="Materiales"
                className={styles.select}
                maxLength={200}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" className={styles.tableButton}>
                  {editId ? 'Guardar Cambios' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormVisible(false)
                    setEditId(null)
                  }}
                  className={styles.tableButton}
                  style={{ backgroundColor: '#d9534f' }}
                >
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
