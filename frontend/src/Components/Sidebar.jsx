import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logout from "./Logout";






const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate()

    const Menus = [
        { title: "Dashboard"},
        { title: "Inbox"},
        { title: "Accounts"},
        { title: "Schedule "},
        { title: "Search", },
        { title: "Analytics"},
        { title: "Files "},
        { title: "Setting"},
      ];


    return (


        <>
            <div className="flex">
                <div
                    className={` ${
                        open ? "w-72" : "w-40 "
                    } bg-blue-600 h-screen p-5  pt-8 relative duration-300`}
                >
                    <img
                        src="./src/assets/control.png"
                        className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
                                        border-2 rounded-full  ${!open && "rotate-180"}`}
                        onClick={() => setOpen(!open)}
                    />

             <div className="flex gap-x-4 items-center">
                <img
                    src="./src/assets/logo.png"
                    className={`cursor-pointer duration-500 ${
                                open && "rotate-[360deg]"
                                }`}
                />

                <h1
                    className={`text-white origin-left font-medium text-xl duration-200 ${
                                !open && "scale-0"
                                }`}
                >
            Designer
          </h1>
        </div>

        <ul className="pt-6">
        <Link to="/homepage" className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4  ">
                        Homepage
                    </Link>
                    <Link to="/championships" className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ">
                        Championships
                    </Link>
                    <Link to="/profile" className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ">
                        Profile
                    </Link>

                    <Logout />

        </ul>
      </div>
    </div>
        </>
    )
}


export default Sidebar
