import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getProfileInfo } from "../services/firestore";

export default function useProfileInfo() {

    const { user } = useAuthContext();

    const [profileInfo, setProfileInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    

    useEffect(()=>{
            if(!user?.uid){
                setProfileInfo(null);
                setLoadingProfile(false);
                return;
            }
            
            setLoadingProfile(true);
            setError(null);

            const unsubscribe = getProfileInfo(user.uid , (data)=>{
                setProfileInfo(data)
                setLoadingProfile(false);
            }, (error)=>{
                setError(error);
                setLoadingProfile(false);
            })

            return () => unsubscribe();
            
        },[user?.uid])
    
    return { profileInfo, error, loadingProfile };
}