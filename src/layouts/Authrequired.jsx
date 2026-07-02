import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Authrequired() {
    const user = true;

    const navigate = useNavigate();

    if (!user) {
        useEffect(() => {
            navigate("/signup");
        },[user])
    }
    if (user) {
    return  <Outlet />
    }
}