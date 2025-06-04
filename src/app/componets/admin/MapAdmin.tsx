'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import styleUser from "@/app/css/User.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/../firebase/clientApp";
import DeleteConfirm from "@/app/componets/DeleteConfirm";
import { envCredentials } from "../../../../firebase/envConfigurations";

interface Admin {
  id: string;
  name: string,
  name2: string,
  surname: string,
  surname2: string,
  phoneNumber: string
}

const MapAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Admin[]>([]);
  const [login, setLogin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { api } = envCredentials();


  useEffect(() => {
    setLogin(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setData([]);
        setLogin(false);
        return;
      }

      try {
        const res = await fetch(`${api}/get-admin`);

        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const teachers: Admin[] = await res.json();
        setData(teachers);
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

  const handleDeleteClick = (admin: { id: string; name: string }) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      console.log("Intentando eliminar:", selectedAdmin.id);

      const response = await fetch(
        `${api}/delete-employee/${selectedAdmin.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "No se pudo eliminar el administrador");
        return;
      }

      setData(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
      console.log("Administrador eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar administrador:", err);
      alert("Error del servidor al intentar eliminar al administrador.");
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
      </div>

      {login && (
        <div>Cargando...</div>
      )}

      <ol className={styleUser.containerUsers}>
        {filteredAdmins.map((admin) => (
          <li key={admin.id} className={styleUser.users}>
            <Link href={`/Administrador/Admins/${admin.id}`}>
              <div className={styleUser.header}>
                <h2 className={styleUser.textHeader}>{admin.surname} {admin.surname2}</h2>
              </div>
              <div className={styleUser.header}>
                <h2 className={styleUser.textHeader}>{admin.name} {admin.name2}</h2>
              </div>
              <div className={styleUser.body}>
                <p>{admin.phoneNumber}</p>
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
