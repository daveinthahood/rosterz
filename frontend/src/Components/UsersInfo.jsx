// Componente delle Info dell'utente che attualmente è loggato '
//
//
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChampCard from "./ChampCard";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [championships, setChampionships] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      const fetchChampionships = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/championships/getchamp?members=${encodeURIComponent(user.email)}`,
          );

          if (!response.ok) {
            const errorMessage = await response.text(); // Leggi il messaggio di errore
            throw new Error(`Errore nella risposta dell'API: ${errorMessage}`);
          }

          const data = await response.json();
          console.log("Dati dei campionati ricevuti:", data);
          setChampionships(data);
        } catch (error) {
          setError(`Impossibile caricare i campionati: ${error.message}`);
          console.error("Errore durante il recupero dei campionati:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchChampionships();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <p>Accesso negato. Effettua il login per visualizzare il profilo.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full mx-auto">
      <div className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-lg shadow-md"></div>

      <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64 dark:bg-gray-800">
        {/* <div class="flex -space-x-2 overflow-hidden justify-center">
            <img class="inline-block h-10 w-15 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
            </img>
        </div> */}

        <h3 class="py-2 font-bold tracking-wide text-center justify-center text-gray-800 uppercase dark:text-white">
          {" "}
          {user.username}{" "}
        </h3>

        <div className="flex items-center justify-center px-3 py-2 bg-gray-200 dark:bg-gray-700">
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {" "}
            {user.email}
          </span>
        </div>
      </div>

      <div>
        <ChampCard />
      </div>
    </div>
  );
};

export default UserProfile;
