import { MdDashboard } from "react-icons/md";
import { TbDrone } from "react-icons/tb";
import { FaAnglesLeft } from "react-icons/fa6";
import { HiBuildingOffice } from "react-icons/hi2";
import { CgLogOut } from "react-icons/cg";
import logo from "../../assets/a2alogo.png";
import Link from "next/link";

const AdminSidePanel = ({ openNav, setOpenNav }) => {

    return (
        <div>
         
        </div>

        // <div className={`w-[270px]  sticky z-20 lg:block   lg:left-0 ${!openNav ? 'right-[100%]' : ''} flex bg-gray-950 shadow-xl lg: rounded-tr-3xl min-h-screen transition ease-in-out delay-150`}>

        //     {<FaAnglesLeft onClick={() => setOpenNav(false)} size={30}
        //         className={`lg:hidden  text-blue-500 block cursor-pointer  bg-transparent absolute top-[50%] right-0`} />
        //     }

        //     <div className="h-full w-full  ">
        //         <div className="w-full h-26  flex items-center px-5 " >
        //             <img src={logo} alt="AERO2ASTRO" />
        //         </div>
        //         <div className="flex-col gap-2 px-3 flex items-center my-5 ">
        //             <Link href={"/admin/dashboard"} className="flex gap-4 w-full cursor-pointer bg-gray-800
        //              text-gray-100
        //             rounded-xl 
        //              hover:bg-blue-700 hover:text-white items-center px-3 py-2 shadow-lg ">
        //                 <MdDashboard size={20} />
        //                 <p className="font-semibold ">Dashboard</p>
        //             </Link>


        //             <Link href={`/admin/dashboard/usertype/Pilots`}

        //                 className="flex gap-4 w-full cursor-pointer bg-gray-800
        //              text-gray-100
        //             rounded-xl 
        //              hover:bg-blue-700 hover:text-white items-center px-3 py-2 shadow-lg ">
        //                 <TbDrone size={20} />
        //                 <p className="font-semibold flex-grow ">Pilots</p>
        //             </Link>


        //             <Link href={`/admin/dashboard/usertype/Processing`}

        //                 className="flex gap-4 w-full cursor-pointer bg-gray-800
        //              text-gray-100
        //             rounded-xl 
        //              hover:bg-blue-700 hover:text-white items-center px-3 py-2 shadow-lg ">
        //                 <HiBuildingOffice size={20} />

        //                 <p className="font-semibold flex-grow ">Processing</p>
        //             </Link>

        //             <Link href={`/admin/dashboard/usertype/DGPS`}

        //                 className="flex gap-4 w-full cursor-pointer bg-gray-800
        //              text-gray-100
        //             rounded-xl 
        //              hover:bg-blue-700 hover:text-white items-center px-3 py-2 shadow-lg ">
        //                 <HiBuildingOffice size={20} />

        //                 <p className="font-semibold flex-grow ">DGPS</p>
        //             </Link>

        //         </div>

        //     </div>
        //     <div className="bg-gray-900 gap-2 text-white hover:bg-gray-950 border-t-2 border-blue-500 cursor-pointer flex items-center justify-center absolute bottom-0 shadow-lg w-full h-14">
        //         <CgLogOut size={25} className="text-blue-500"/>
        //         Log Out
        //     </div>

        // </div>
    );
}

export default AdminSidePanel;
