import { Outlet } from "react-router-dom";
export default function Authrequired() {
    const user = true;
    if (user) {
    return  <Outlet />
    }
}