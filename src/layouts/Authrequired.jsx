import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../authContext"
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";


export default function Authrequired() {
    const { user,loading } = useAuthContext();
    
    if(loading){
        return (
            <div className="flex bg-background">
                <NavBar />
                <div className="w-full h-screen flex items-start justify-center p-section">
                    <Loader/>
                </div>
            </div>
    )
    }
    if(!user){
        return <Navigate to='/signup' replace/>
    } 
    if(user){
        return (
            <div className="flex bg-background">
                <NavBar/>
                <Outlet />
            </div>
        )
    }
}