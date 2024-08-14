import axios from "axios"
import { useEffect, useState } from "react";
import { io } from "socket.io-client"

import CampModal from "../Modal/CampModal";


const socket = io("http://localhost:3000");


const Championship = () => {
    const [championshipId, setChampionshipId] = useState() //id del campionato
    const [message, setMessage] = useState('')

    //modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false)


    useEffect(() => {
        //unione al campionato
        socket.emit('joinChampionship', championshipId);

        //aggiornamento punteggi here

        return () => {
            socket.emit('leaveChampionship', championshipId)
        }

    }, [championshipId])


    const partecipateChamp = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/championship/${id}/members`);
            setMessage(response.data.message)
            socket.emit('joinChampionship', championshipId) //unione alla stanza
            console.log(championshipId);

        } catch (error) {
            setMessage(`Error joining championship: ${error.response.data.error}`)
        }
    }


    return (
    <>
        <div>
            <h2>Championship</h2>
                <button onClick={partecipateChamp}>Partecipa</button>
            <p>{message}</p>
        </div>

        <div>
         <button onClick={openModal}>Crea Competizione</button>
            <CampModal isOpen={isModalOpen} onClose={closeModal} />
    </div>

    </>
    )
}


export default Championship
