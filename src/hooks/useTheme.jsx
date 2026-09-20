import { useState, useEffect } from "react";
import useProfileInfo from "./useProfileInfo";
import { updateProfileInfo } from "../services/firestore";
import { useAuthContext } from "../AuthContext";

export default function useTheme() {
    const { profileInfo } = useProfileInfo();
    const { user } = useAuthContext()

    const [mode, setMode] = useState(profileInfo?.mode || 'light mode');
    
        useEffect(()=>{
            if(profileInfo?.mode){
                setMode(profileInfo.mode);
            }
        }, [profileInfo?.mode]);
    
        useEffect(() => {
            if(mode === 'dark mode'){
                document.documentElement.classList.add("dark");
            }else if(mode === 'light mode'){
                document.documentElement.classList.remove("dark");
            }
        }, [mode]);

        async function switchMode(){
            if(!user?.uid) return;
    
            const newMode = mode === 'dark mode' ? 'light mode' : 'dark mode';

            try{
                await updateProfileInfo(user?.uid, { mode: newMode });
            }catch(err){
                console.log(err);
            }
        }
        return { mode, switchMode };
}