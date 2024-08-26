import Sidebar from "../Components/Sidebar"
import UserProfile from "../Components/UsersInfo"


const Profile = () => {
    return (
        <>
            <div className="flex">
                 <Sidebar />


               <div className="h-screen flex-1 p-7">
                    <UserProfile />
               </div>

            </div>

        </>
    )
}


export default Profile
