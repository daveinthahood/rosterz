import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setUser, setError } from '../slice/authSlice'; // Assicurati che il percorso sia corretto
import Sidebar from '../Components/Sidebar';
import CampModal from '../Modal/CampModal';

const socket = io('http://localhost:3000');

const ChampionshipList = () => {
  const [championships, setChampionships] = useState([]);
  const [error, setErrorState] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.status) === 'loading';
  const [currentPage, setCurrentPage] = useState(1);
  const championshipsPerPage = 10; // Numero di campionati per pagina

   //modal
   const [isModalOpen, setIsModalOpen] = useState(false)
   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false)



  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/championships/get');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChampionships(data);
      } catch (error) {
        console.error('Error fetching championships:', error);
        setErrorState(error.message);
      }
    };

    fetchChampionships();

    socket.on('championshipUpdated', (updatedChampionship) => {
      setChampionships((prevChampionships) =>
        prevChampionships.map((champ) =>
          champ.id === updatedChampionship.id
            ? { ...champ, members: Array.isArray(champ.members) ? [...champ.members, updatedChampionship.newMember] : [updatedChampionship.newMember] }
            : champ
        )
      );
    });

    return () => {
      socket.off('championshipUpdated');
    };
  }, []);

  const participateInChampionship = async (championshipId) => {
    if (!user) {
      alert('You need to be logged in to join a championship.');
      return;
    }

    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('Token:', token);

    try {
      const response = await fetch(`http://localhost:3000/api/championships/${championshipId}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }), // Usa l'email dell'utente invece dell'ID
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      alert(data.message);

      socket.emit('championshipUpdated', { id: championshipId, newMember: user.email });

    } catch (error) {
      console.error('Error participating in championship:', error);
      alert('Failed to join the championship.');
    }
  };

 // Calcolare i campionati da mostrare nella pagina corrente
 const indexOfLastChampionship = currentPage * championshipsPerPage;
 const indexOfFirstChampionship = indexOfLastChampionship - championshipsPerPage;
 const currentChampionships = championships.slice(indexOfFirstChampionship, indexOfLastChampionship);

 // Cambiare pagina
 const paginate = (pageNumber) => setCurrentPage(pageNumber);

 if (loading) return <p>Loading...</p>;


  return (
    <>
        <div className="flex">
  <Sidebar />

  <div className="flex-1 flex justify-center items-start">
    <div className="relative overflow-x-auto w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista dei Campionati</h1>

      <div>
         <button onClick={openModal}>Crea Competizione</button>
            <CampModal isOpen={isModalOpen} onClose={closeModal} />

      </div>

      {error && <p className="text-red-500 mb-4 text-center">Error: {error}</p>}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nome del Campionato
            </th>
            <th scope="col" className="px-6 py-3">
              Partecipanti
            </th>
            <th scope="col" className="px-6 py-3">
              Azione
            </th>
          </tr>
        </thead>
        <tbody>
          {currentChampionships.map((championship) => (
            <tr key={championship.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {championship.name}
              </th>
              <td className="px-6 py-4">
                {championship.members} Partecipanti
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => participateInChampionship(championship.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Partecipa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginazione */}
      <nav className="flex justify-center mt-4">
        <ul className="inline-flex items-center -space-x-px">
          {[...Array(Math.ceil(championships.length / championshipsPerPage)).keys()].map(number => (
            <li key={number}>
              <button
                onClick={() => paginate(number + 1)}
                className={`px-3 py-2 leading-tight ${
                  currentPage === number + 1
                    ? 'text-blue-600 bg-blue-50 border border-blue-300'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
</div>
    </>
  );
};

export default ChampionshipList;
