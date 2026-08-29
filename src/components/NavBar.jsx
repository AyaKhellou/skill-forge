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
    
    
    const { user, loading } = useAuthContext();

    useEffect(()=>{
        const unsubscribe = onSnapshot(
            doc(db,"users", user?.uid), 
            (snapshot)=>{
                if (snapshot.exists()) {
                    const data = snapshot.data()
                    setProfileInfo(data)
                    setDarkMode(data.mode === "dark mode")
                }
            },(error) => {
            console.error("Error fetching goal data: ", error);
        })
        return () => unsubscribe();
    },[user])

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // useEffect(()=>{
    //     if(!profileInfo) return;
    //     if(profileInfo){
    //         if (profileInfo.mode === "dark mode") {
    //             setDarkMode(true)
    //         }
    //         if (profileInfo.mode === "light mode") {
    //             setDarkMode(false)
    //         }
    //     }
    // },[profileInfo,user])

    

    async function switchMode(){
        if(!user?.uid) return;

        const newMode = darkMode ? "light mode" : "dark mode" 

        try{
            await updateDoc(doc(db, "users", user?.uid), {
                mode: newMode
            });
            console.log("updated!");
        }catch(err){
            console.log(err);
        }
    }
    

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
                    <div className="flex flex-col gap-2 bg-card-background p-3 rounded shadow">
                        <p className="detail flex items-center gap-1 px-2 py-1">
                            <User width={17} className="text-accent!"/>
                            {loading ? "---" : user.displayName}
                        </p>
                        <a className="text-accent! hover:bg-background px-2 py-1 rounded font-bold font-figtree cursor-pointer flex items-center gap-1" onClick={logout} >
                            <LogOut width={17} className="text-accent!"/>
                            <p className="detail">Log Out</p>
                        </a>
                        <button className="detail hover:bg-background px-2 py-1 rounded flex gap-1 items-center cursor-pointer" onClick={switchMode}>
                            {darkMode? 
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