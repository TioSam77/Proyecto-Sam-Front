'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/clientApp";

export default function Page() {
  const { courseId } = useParams();
  const [exists, setExists] = useState<null | boolean>(null);

  useEffect(() => {
    const checkCourse = async () => {
      const ref = doc(db, "course", String(courseId));
      const snap = await getDoc(ref);
      setExists(snap.exists());
    };
    checkCourse();
  }, [courseId]);

  if (exists === null) return <p>Cargando...</p>;
  if (!exists) return null;

  return (
    <div>
      <h1>Curso válido: {courseId}</h1>
    </div>
  );
}
