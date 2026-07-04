import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../authContext"
import NavBar from "../components/NavBar";


export default function Authrequired() {
    const { user } = useAuthContext();

    if(!user){
        return <Navigate to='signup' replace/>
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