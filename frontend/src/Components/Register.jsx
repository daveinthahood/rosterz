import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '../slice/authSlice'; // Assicurati che il percorso sia corretto

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState(''); // Gestione dell'errore
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError(''); // Resetta l'errore su submit

        try {
            const response = await axios.post('http://localhost:3000/api/users/register', {
                username,
                email,
                password,
            });

            if (response.status === 200) {
                // Effettua il login automaticamente dopo la registrazione
                const loginResponse = await axios.post('http://localhost:3000/api/users/login', {
                    email,
                    password,
                });

                const { user, token } = loginResponse.data;
                dispatch(setUser({ ...user, token }));
                setSuccess('Registrazione completata con successo!');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Errore durante la registrazione. Riprova.'); // Mostra errore specifico
            console.error('Errore durante la registrazione:', error);
        }
    };

    return (
        <div className="registration-form">
            <h2>Registrazione</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrati</button>
            </form>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>} {/* Mostra l'errore se presente */}
        </div>
    );
};

export default Register;
