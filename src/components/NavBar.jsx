import Logo from "./Logo"
import { Link, NavLink } from "react-router-dom"
import { useAuthContext } from "../authContext";
import { logout } from "../firebase/firestore"
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function NavBar(){
    const [darkMode, setDarkMode] = useState(null)
    const [menuIsHidden,setMenuIsHidden] = useState(true)
    const [profileInfo, setProfileInfo] = useState(null)
    
    function switchMode(){
        setDarkMode(prev=> !prev)
    }
    const { user, loading } = useAuthContext();

    useEffect(()=>{
        async function getprofileInfo() {
            onSnapshot(doc(db,"users", user?.uid), (doc)=>{
                setProfileInfo(doc.data())
            }),(error) => {
                console.error("Error fetching goal data: ", error);
            }
        }
        getprofileInfo()
    },[user])

    useEffect(()=>{
        if(profileInfo){
            setDarkMode(profileInfo?.mode === "dark mode" ? true : false)
        }
    },[profileInfo,user])

    console.log(profileInfo);
    

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add("dark");
        }
        if(!darkMode){
            document.documentElement.classList.remove("dark");
        }

        async function updateProfile(){
        
        try{
            await updateDoc(doc(db, "users", user?.uid), {
                mode: darkMode ? "dark mode" : "light mode"
            });
            console.log("updated!");
            
        }catch(err){
            console.log(err);
        }
        }
        updateProfile()
    }, [darkMode]);

    

    const activeStyles = "nav-link border border-primary!" ;

    return(
        <aside className="flex flex-col bg-background border-r border-border-color h-screen w-[20%] pt-section px-4">
            <Logo />
            <nav className="w-full flex flex-col gap-2 mt-6">
                <NavLink end
                to="/user"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Dashboard</NavLink>
                <NavLink to="goals"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Goals</NavLink>
                <NavLink to="studysessions"
                className={ ({isActive})=>isActive ? activeStyles : "nav-link"}
                >Study Sessions</NavLink>
            </nav>
            <div className="flex items-end gap-2 fixed bottom-6 left-4">
                <div 
                onClick={()=>setMenuIsHidden(prev=> !prev)}
                className="rounded-[50%] w-10 h-10 flex items-center justify-center bg-accent cursor-pointer overflow-hidden"
                >
                <img src={profileInfo?.pfp} alt="user pfp" />
                </div>
                {
                    !menuIsHidden &&
                    <div className="flex flex-col bg-card-background p-3 rounded shadow">
                        <p className="detail flex items-center gap-1">
                            <User width={17} className="text-accent!"/>
                            {loading ? "---" : user.displayName}
                        </p>
                        <a className="text-accent! font-bold font-figtree cursor-pointer flex items-center gap-1" onClick={logout} >
                            <LogOut width={17} className="text-accent!"/>
                            <p className="detail">Log Out</p>
                        </a>
                        <button className="detail flex gap-1 items-center" onClick={switchMode}>
                            {darkMode? 
                                <Sun width={17} className=" text-accent!"/>
                                :
                                <Moon width={17} className=" text-accent!"/>
                            }
                            switch mode
                        </button>
                        <Link to="/user/settings"
                        className="cursor-pointer flex items-center gap-1" >
                            <Settings width={17} className="text-accent!"/>
                            <p className="detail">Settings</p>
                        </Link>
                    </div>
                }
            </div>
        </aside>
    )
}