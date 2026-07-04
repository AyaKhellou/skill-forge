import { Outlet, Navigate } from "react-router-dom"
import LandingPageHeader from "../components/LandingPageHeader"
import { useAuthContext } from "../authContext"

export default function LandingLayout(){
    const { user } = useAuthContext();
    
    if(user) return <Navigate to="/dashboard" replace/>
    
    if(!user){
        return(
        <>
            <div className="absolute -z-10 top-10 left-10 w-80 h-80 rounded-full bg-[#FF5D73]/20 blur-[120px]" />
            <div className="absolute -z-10 bottom-20 right-0 w-125 h-125 rounded-full bg-[#F4B400]/15 blur-[150px]" />
            <div className="absolute -z-10 top-1/2 left-1/3 w-60 h-60 rounded-full bg-[#FF5D73]/10 blur-[100px]" />
            <LandingPageHeader/>
            <Outlet/>
        </>
    )
    }
}