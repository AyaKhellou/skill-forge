import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getProfileInfo, updateProfileInfo } from "../services/firestore";
import { deleteUser, updateProfile } from "firebase/auth";


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

    async function updateUserDetails(dataToUpdate) {
        await updateProfileInfo(user.uid, dataToUpdate);
    }

    async function updateUserProfile(dataToUpdate) {
        await updateProfile(user, dataToUpdate);
    }

    async function deleteUserAccount() {
        await deleteUser(user);
    }
        
    return { profileInfo, error, loadingProfile, updateUserDetails, updateUserProfile, deleteUserAccount };
}