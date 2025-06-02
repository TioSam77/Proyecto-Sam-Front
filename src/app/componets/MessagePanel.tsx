"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/css/PrivateMessages.module.css";
import PrivateMessages from "./PrivateMessage";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  or,
  documentId,
} from "firebase/firestore";
import { db } from "../../../firebase/clientApp";
import { getAuth } from "firebase/auth";

export default function MessagePanel() {
  const [tab, setTab] = useState<"professors" | "students">("professors");
  const [results, setResults] = useState<{ uid: string; name: string }[]>([]);
  const [previousChats, setPreviousChats] = useState<{ uid: string; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    uid: string;
    name: string;
  } | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");

  const auth = getAuth();
  const currentUserUid = auth.currentUser?.uid || "";

  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!currentUserUid) return;

      const q = query(
        collection(db, "private-messages"),
        where("users", "array-contains", currentUserUid)
      );

      try {
        const snap = await getDocs(q);
        const userUids = new Set<string>();

        snap.forEach((doc) => {
          const users: string[] = doc.data().users;
          const otherUid = users.find((uid) => uid !== currentUserUid);
          if (otherUid) userUids.add(otherUid);
        });

        const uidsArray = Array.from(userUids).slice(0, 20); // Limite de 20
        const professorsSnap = await getDocs(collection(db, "teacher"));
        const studentsSnap = await getDocs(collection(db, "student"));
        const allUsers = [...professorsSnap.docs, ...studentsSnap.docs];

        const chats: { uid: string; name: string }[] = [];

        allUsers.forEach((doc) => {
          if (uidsArray.includes(doc.id)) {
            const data = doc.data();
            const fullName = `${data.surname || ""} ${data.surname2 || ""} ${data.name || ""} ${data.name2 || ""}`.trim();
            chats.push({ uid: doc.id, name: fullName });
          }
        });

        setPreviousChats(chats);
      } catch (error) {
        console.error("Error cargando chats previos:", error);
      }
    };

    fetchPreviousChats();
  }, [currentUserUid]);

  const handleSearch = async () => {
    setMessage("");

    if (data.trim() === "") {
      setResults([]);
      setMessage("Debes colocar primero el nombre");
      return;
    }

    const collectionName = tab === "professors" ? "teacher" : "student";
    const q = query(
      collection(db, collectionName),
      where("name", ">=", data),
      where("name", "<=", data + "\uf8ff"),
      limit(20)
    );

    try {
      const querySnapshot = await getDocs(q);
      const users: { uid: string; name: string }[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const fullName = `${userData.surname || ""} ${userData.surname2 || ""} ${userData.name || ""} ${userData.name2 || ""}`.trim();
        users.push({ uid: doc.id, name: fullName });
      });

      setResults(users);
      if (users.length === 0) {
        setMessage("No se encontraron usuarios con ese nombre");
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      setResults([]);
      setMessage("Ocurrió un error al buscar");
    }
  };

  const handleSelectUser = (user: { uid: string; name: string }) => {
    setSelectedUser(user);
    setShowChat(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        <button
          className={tab === "professors" ? styles.activeTab : ""}
          onClick={() => {
            setTab("professors");
            setResults([]);
            setShowChat(false);
          }}
        >
          Profesores
        </button>
        <button
          className={tab === "students" ? styles.activeTab : ""}
          onClick={() => {
            setTab("students");
            setResults([]);
            setShowChat(false);
          }}
        >
          Estudiantes
        </button>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder={`Buscar ${tab === "professors" ? "profesor" : "estudiante"}...`}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button className="bluebutton" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.results}>
        {results.map((user) => (
          <div
            key={user.uid}
            className={styles.resultItem}
            onClick={() => handleSelectUser(user)}
          >
            {user.name}
          </div>
        ))}
      </div>
      
      {previousChats.length > 0 && (
        <div className={styles.previousChats}>
          <p>Chats recientes:</p>
          {previousChats.map((user) => (
            <div
              key={user.uid}
              className={styles.resultItem}
              onClick={() => handleSelectUser(user)}
            >
              {user.name}
            </div>
          ))}
        </div>
      )}


      {showChat && selectedUser && (
        <PrivateMessages
          onClose={() => {
            setShowChat(false);
            setSelectedUser(null);
          }}
          currentUserUid={currentUserUid}
          selectedUserUid={selectedUser.uid}
          selectedUserName={selectedUser.name}
        />
      )}
    </div>
  );
}
