import Logo from "./Logo"
import { Link, NavLink } from "react-router-dom"
import { useAuthContext } from "../AuthContext";
import { logout } from "../services/firestore"
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import useTheme from "../hooks/useTheme";
import useProfileInfo from "../hooks/useProfileInfo";
import errorIcon from "../assets/error.png"
import Loader from "./Loader";

export default function NavBar({ isVisible, setIsVisible }){

    const [menuIsHidden,setMenuIsHidden] = useState(true)
    
    
    const { user, loading } = useAuthContext();
    
    const { profileInfo, error, loadingProfile } = useProfileInfo();    

    const { mode, switchMode } = useTheme();

    const activeStyles = "nav-link border border-primary!" ;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        function handleResize() {
            const currentWidth = window.innerWidth;
            setWindowWidth(currentWidth);
            if(currentWidth <= 767){
                setIsVisible(false);
            }else{
                setIsVisible(true);
            }
            console.log('current width: ' ,currentWidth);
            console.log('window width: ' ,windowWidth);
            
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return(
        <aside 
        className={`
        flex flex-col bg-background border-r border-border-color h-screen w-62.5 pt-section px-4 z-10 max-md:fixed max-sm:w-52
        ${!isVisible ? 'hidden' : ''}
        `}>
            <Logo />
            <nav className="w-full flex flex-col gap-2 mt-6">
                <NavLink end
                to="/user"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Dashboard</NavLink>
                <NavLink to="goals"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Goals</NavLink>
                <NavLink to="study-sessions"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Study Sessions</NavLink>
            </nav>
            <div className="flex items-end gap-2 fixed bottom-6 left-4">
                <button 
                onClick={()=>setMenuIsHidden(prev=> !prev)}
                className="rounded-[50%] w-10 h-10 flex items-center justify-center bg-accent cursor-pointer overflow-hidden"
                >
                {   loadingProfile ?
                    <Loader className="w-4 h-4"/>
                    :
                    profileInfo?.pfp === undefined || profileInfo?.pfp === null || error ?
                    <div className="bg-accent">
                        <img src={errorIcon} width={25} alt="error" />
                    </div>
                    :
                    <img src={profileInfo?.pfp} alt="user pfp" />
                }
                </button>
                {
                    !menuIsHidden &&
                    <div className="flex flex-col gap-2 bg-card-background p-3 rounded shadow">
                        <p className="detail flex items-center gap-1 px-2 py-1">
                            <User width={17} className="text-accent!"/>
                            {loading ? "---" : user.displayName}
                        </p>
                        <button className="text-accent! hover:bg-background px-2 py-1 rounded font-bold font-figtree cursor-pointer flex items-center gap-1" onClick={logout} >
                            <LogOut width={17} className="text-accent!"/>
                            <p className="detail">Log Out</p>
                        </button>
                        <button className="detail hover:bg-background px-2 py-1 rounded flex gap-1 items-center cursor-pointer" 
                        onClick={switchMode}>
                            {mode === 'dark mode' ? 
                                <Sun width={17} className=" text-accent!"/>
                                :
                                <Moon width={17} className=" text-accent!"/>
                            }
                            switch mode
                        </button>
                        <Link to="/user/settings"
                        className="cursor-pointer flex items-center gap-1 hover:bg-background px-2 py-1 rounded" >
                            <Settings width={17} className="text-accent!"/>
                            <p className="detail">Settings</p>
                        </Link>
                    </div>
                }
            </div>
        </aside>
    )
}