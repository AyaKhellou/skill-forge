import Logo from "./Logo"
import Button from "./Button"
import { NavLink } from "react-router-dom"
import { useAuthContext } from "../authContext";

export default function NavBar(){
    const { user } = useAuthContext();

    const activeStyles = "nav-link border border-primary!" ;

    return(
        <aside className="flex flex-col bg-background justify-stretch border-r border-detail h-screen w-[20%] pt-section px-4">
            <Logo />
            <nav className="w-full flex flex-col gap-2 mt-6">
                <NavLink 
                to="/dashboard"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Dashboard</NavLink>
                <NavLink to="/learningpaths"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Learning Paths</NavLink>
                <NavLink to="/skills"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Skills</NavLink>
                <NavLink to="/projects"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Projects</NavLink>
                <NavLink to="/studysessions"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Study Sessions</NavLink>
                <NavLink to="/achievements"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Achievements</NavLink>
            </nav>
            <div className="flex items-center gap-2 profile mt-16">
                <div 
                className="rounded-[50%] w-10 h-10 flex items-center justify-center bg-accent"
                >{"Aya Khellou"[0]}</div>
                <p className="">{user.displayName}</p>
            </div>
        </aside>
    )
}