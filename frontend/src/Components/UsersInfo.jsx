// frontend/src/components/Profile.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {
    const { user, token } = useSelector((state) => state.auth);

    // Se non c'è un utente, puoi reindirizzare a una pagina di login o mostrare un messaggio di errore
    if (!user) {
        return <p>Accesso negato. Effettua il login per visualizzare il profilo.</p>;
    }

    return (
        <div>
            <h1>Profilo Utente</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Aggiungi altre informazioni dell'utente se disponibili */}
            <p><strong>Token:</strong> {token}</p> {/* Puoi decidere se mostrare il token o meno */}
        </div>
    );
};

export default UserProfile;
