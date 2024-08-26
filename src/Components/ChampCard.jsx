import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';



const ChampCard = () => {
    const [championships, setChampionships] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.email) {
            const fetchChampionships = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/championships/getchamp?members=${encodeURIComponent(user.email)}`);

                    if (!response.ok) {
                        const errorMessage = await response.text(); // Leggi il messaggio di errore
                        throw new Error(`Errore nella risposta dell'API: ${errorMessage}`);
                    }

                    const data = await response.json();
                    console.log('Dati dei campionati ricevuti:', data);
                    setChampionships(data);
                } catch (error) {
                    setError(`Impossibile caricare i campionati: ${error.message}`);
                    console.error('Errore durante il recupero dei campionati:', error);
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
        return <p>Accesso negato. Effettua il login per visualizzare il profilo.</p>;
    }
    return (

        <>
            <h1> I tuoi Campionati </h1>
            {loading && <p>Caricamento dei campionati in corso...</p>}
            {error && <p>{error}</p>}
            {championships.length === 0 && !loading && !error && <p>Nessun campionato trovato.</p>}
            {championships.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Nome Campionato</th>
                            <th>Data Inizio</th>
                            <th>Data Fine</th>
                        </tr>
                    </thead>
                    <tbody>
                        {championships.map(championship => (
                            <tr key={championship.id}>
                                <td>{championship.name}</td>
                                <td>{new Date(championship.startDate).toLocaleDateString()}</td>
                                <td>{new Date(championship.endDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}

export default ChampCard
