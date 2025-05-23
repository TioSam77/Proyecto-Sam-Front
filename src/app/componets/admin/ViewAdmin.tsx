'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/app/css/ViewAdmin.module.css';
import { useParams, usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/../firebase/clientApp';
import Link from 'next/link';

interface Admin {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

const ViewAdmin = () => {
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const pathname = usePathname();

  const params = useParams();
  const adminId = params?.id as string;


  useEffect(() => {
    if (!pathname) return;

    if (!adminId) {
      setNotFound(true);
      return;
    }

    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const adminRef = doc(db, 'admin', adminId);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          setNotFound(true);
          return;
        }

        setAdminData({ id: adminSnap.id, ...adminSnap.data() });
      } catch (err) {
        console.error("Error al obtener datos del administrador:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [pathname]);

  if (notFound) return <p>Administrador no encontrado.</p>;
  if (loading) return <p>Cargando datos del administrador...</p>;

  return (
    <div className={styles.adminCard}>
      <div className={styles.headerButton}>
        <h3 className={styles.adminName}>
          {(adminData?.surname && adminData?.name)
            ? `${adminData.surname} ${adminData.name}`
            : 'Nombre del administrador'}
        </h3>
        <Link href={`${adminId}/Editar`}>
          <button className='bluebutton'>Editar</button>
        </Link>
      </div>

      <div className={styles.adminDetails}>
        <p><strong>Correo:</strong> {adminData?.email || '-'}</p>
        <p><strong>Teléfono:</strong> {adminData?.phoneNumber || '-'}</p>
        <p><strong>Rol:</strong> {adminData?.role || 'Administrador General'}</p>
      </div>
    </div>
  );
};

export default ViewAdmin;
