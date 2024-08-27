// questo è il componente che ci fa vedere le pagine singole di ogni campionato
// campionato 1 pagina 1
// campionato 2 pagina 2

import JoinChampionship from "../Components/Championship";
import Sidebar from "../Components/Sidebar";

const ChampionshipsPages = () => {
  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="h-screen flex-1 p-7">
          <JoinChampionship />
        </div>
      </div>
    </>
  );
};

export default ChampionshipsPages;
