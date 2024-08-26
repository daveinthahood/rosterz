import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate() // Per la redirezione

    const handleLogout = () => {
        dispatch(logout()); // Esegui il logout
        // Opzionalmente, redirigi l'utente a una pagina specifica
        navigate('/login'); // Redirige l'utente alla pagina di login
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
