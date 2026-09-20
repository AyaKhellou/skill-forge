import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../AuthContext"
import LoadingScreen from "../components/LoadingScreen";


export default function ProtectedRoute() {
    const { user,loading,error } = useAuthContext();

    
    if(loading) {
        return <LoadingScreen/>
    }
    if(!user){
        return <Navigate to='/signup' replace/>
    } 
    if(error){
        return (
            <div className="flex bg-background">
                <div className="w-full h-screen flex items-start justify-center p-section">
                    <p className="text-red-500 text-lg">{error.message}</p>
                </div>
            </div>
        )
    }
    return (
        <Outlet />
    )
}