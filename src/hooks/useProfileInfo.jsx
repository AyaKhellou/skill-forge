import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getProfileInfo, updateProfileInfo } from "../services/firestore";
import { deleteUser, updateProfile } from "firebase/auth";


export default function useProfileInfo() {

    const { user } = useAuthContext();

    const [profileInfo, setProfileInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    

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
        setIsUpdating(true);
        try {
            await updateProfileInfo(user?.uid, dataToUpdate);
        } finally {
            setIsUpdating(false);
        }
    }

    async function updateUserProfile(dataToUpdate) {
        setIsUpdating(true);
        try {
            await updateProfile(user, dataToUpdate);
        } finally {
            setIsUpdating(false);
        }
    }

    async function deleteUserAccount() {
        await deleteUser(user);
    }
        
    return { profileInfo, error, loadingProfile, updateUserDetails, updateUserProfile, isUpdating, deleteUserAccount };
}