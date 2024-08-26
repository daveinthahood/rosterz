import JoinChampionship from "../Components/Championship"
import Sidebar from "../Components/Sidebar"




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
    )
}


export default ChampionshipsPages
