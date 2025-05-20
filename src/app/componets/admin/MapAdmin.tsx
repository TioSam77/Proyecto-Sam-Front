'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/../firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import DeleteConfirm from "@/app/componets/DeleteConfirm";

interface Admin {
  id: string;
  name: string;
}

const MapAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Admin[]>([]);
  const [login, setLogin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    setLogin(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setData([]);
        setLogin(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "admin"));
        const allData: Admin[] = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            name: `${docData.name || ''} ${docData.surname || ''}`.trim(),
          };
        });

        setData(allData);
      } catch (err) {
        console.error("Error al obtener administradores:", err);
      } finally {
        setLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredAdmins = data.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await deleteDoc(doc(db, "admin", selectedAdmin.id));
      setData(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
    } catch (err) {
      console.error("Error al eliminar administrador:", err);
    } finally {
      setShowModal(false);
      setSelectedAdmin(null);
    }
  };

  return (
    <section className={styleUser.center}>

      <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Buscar administrador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchBox"
        />
        <button className="bluebutton">Buscar</button>
        <Link href={`/Administrador/Admins/Registro`}>
          <button className={styleUser.button}>Nuevo Admin</button>
        </Link>
      </div>

      {login && (
        <div>Cargando...</div>
      )}

      <ol className={styleUser.containerUsers}>
        {filteredAdmins.map((admin) => (
          <li key={admin.id} className={styleUser.users}>
            <Link href={`/Administrador/Admins/${admin.id}`}>
              <div className={styleUser.header}>
                <h2 className={styleUser.textHeader}>{admin.name}</h2>
              </div>
              <div className={styleUser.body}>
                <h5>Información sobre {admin.name}</h5>
              </div>
            </Link>

            <div className={styleUser.containerButton}>
              <Link href={`/Administrador/Admins/${admin.id}/Editar`}>
                <button className="bluebutton">Editar</button>
              </Link>
              <button
                className="redbutton"
                onClick={() => handleDeleteClick(admin)}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </div>
          </li>
        ))}
      </ol>

      {showModal && selectedAdmin && (
        <DeleteConfirm
          name={selectedAdmin.name}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowModal(false);
            setSelectedAdmin(null);
          }}
        />
      )}
    </section>
  );
};

export default MapAdmin;
