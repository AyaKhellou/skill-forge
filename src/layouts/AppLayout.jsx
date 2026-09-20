import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";


export default function AppLayout() {
    const [isNavBarVisible, setIsNavBarVisible] = useState(true);

    function hideNavBar() {
        setIsNavBarVisible(prev => !prev);
    }
    return (
        <div className="flex bg-background">
            <NavBar isVisible={isNavBarVisible} setIsVisible={setIsNavBarVisible} />
            <button 
            className={
                `cursor-pointer = self-start rounded mt-2  main-transition max-md:absolute 
                ${isNavBarVisible ? 'left-62.5 max-sm:left-52' : 'left-0'} top-0 z-20`
            }
            onClick={hideNavBar}>
                {
                    isNavBarVisible ? 
                    <ChevronsLeft />
                    :
                    <ChevronsRight />}
            </button>
            <Outlet />
        </div>
    )
}