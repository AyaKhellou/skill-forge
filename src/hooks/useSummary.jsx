import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuthContext } from "../AuthContext"; 

export default function useSummary(){
    const { user } = useAuthContext();

    const [recentStudySession, setRecentStudySession] = useState(null)
    const [loadingRecentStudySession, setLoadingRecentStudySession] = useState(true)
    const [recentStudyError, setRecentStudyError] = useState(null)
    useEffect(()=>{
        async function fetchData() {
            onSnapshot(doc(db,"users", user.uid), (doc) => {
                setRecentStudySession(doc.data().recentStudySession)
                setLoadingRecentStudySession(false);
                setRecentStudyError(null);
            }, (error) => {
                setRecentStudyError(error);
                setLoadingRecentStudySession(false);
            })
        }
        fetchData();
    },[user])

    return { recentStudySession, loadingRecentStudySession, recentStudyError };
}