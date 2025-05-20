'use client';

import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import styles from '@/app/css/Table.module.css';
import { db } from '../../../firebase/clientApp';

interface Movement {
  id: string;
  responsable: string;
  fecha: string;
  accion: string;
  tabla: string;
  detalles: string | object;
}

const Record: React.FC = () => {
  const [data, setData] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'movements'));
        const results: Movement[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as Movement);
        });
        setData(results);
      } catch (error) {
        console.error('Error fetching movements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const headers =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== 'id')
      : ['responsable', 'fecha', 'accion', 'tabla', 'detalles'];

  return (
    <div className={styles.TableContainer}>
      <h3>Historial de modificaciones</h3>
      <div className={styles.box}>
        {loading ? (
          <p className={styles.loading}>Cargando movimientos...</p>
        ) : (
          <table>
            <thead>
              <tr className={styles.fixedRow}>
                {headers.map((header, idx) => (
                  <th
                    key={header}
                    className={idx === 0 ? styles.fixedColRow : styles.noting}
                  >
                    {header.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`${styles.fixedCol} ${rowIndex % 2 === 0 ? styles["row-even"] : styles["row-odd"]}`}
                  >
                    {headers.map((key, colIndex) => (
                      <td
                        key={colIndex}
                        className={colIndex === 0 ? styles.fixedCol : ''}
                      >
                        {key === 'detalles'
                          ? JSON.stringify(row[key as keyof Movement])
                          : String(row[key as keyof Movement])}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className={styles.noData}>
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Record;
