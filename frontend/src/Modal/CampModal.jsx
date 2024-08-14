import { useState } from 'react'
import './campmodal.css'



const CampModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('')
    const [championshipLink, setChampionshipLink] = useState('')
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/api/championships', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({name})
            });
            if(!response.ok) {
                throw new Error('Errore nella creazione della competizione');

            }
            const result = await response.json()
            const championshipId = result.id;
            const link = `http://localhost:5173/join/${championshipId}`
            setChampionshipLink(link)
            console.log(result);
            onClose()
        } catch (error) {
            console.error(error);
        }
    }
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crea Competizione</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Crea</button>
          <button type="button" onClick={onClose}>Annulla</button>
        </form>
        {championshipLink && (
            <div>
                <p> Competizione creata condividi il link</p>
                <a href={championshipLink}> {championshipLink} </a>
            </div>
        )}

      </div>
    </div>
    )
}

export default CampModal
