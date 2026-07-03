import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../authContext"


export default function Authrequired() {
    const { user } = useAuthContext();

    return user ? <Outlet/> : <Navigate to="/signup" replace/>
}