import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JoinChampionship() {
  const { name, id } = useParams();
  const [championship, setChampionship] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampionship = async () => {
      try {
        const url = `http://localhost:3000/api/championships/join/${name}/${id}`; // Modifica con la porta corretta
        console.log("Fetching from URL:", url); // Log dell'URL
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Errore sconosciuto");
          return;
        }
        const data = await response.json();
        setChampionship(data);
      } catch (err) {
        console.error("Fetch error:", err); // Log dell'errore
        setError("Errore di rete. Riprova più tardi.");
      }
    };

    fetchChampionship();
  }, [name, id]);

  if (error) {
    return <div>Errore: {error}</div>;
  }

  if (!championship) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{championship.name}</h1>
      <p>ID: {championship.id}</p>
      <p>Data di Inizio: {championship.startDate}</p>
      <p>Partecipanti: {championship.participants}</p>
      {/* altre informazioni */}
    </div>
  );
}

export default JoinChampionship;
