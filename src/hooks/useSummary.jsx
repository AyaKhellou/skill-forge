import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuthContext } from "../AuthContext"; 

export default function useSummary(){
    const { user } = useAuthContext();

    const [recentStudySession, setRecentStudySession] = useState(null)
    const [loadingRecentStudySession, setLoadingRecentStudySession] = useState(true)
    const [recentStudyError, setRecentStudyError] = useState(null)
    
    useEffect(() => {
    if (!user) return;

    setLoadingRecentStudySession(true);

    const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        (doc) => {
            setRecentStudySession(doc.data()?.recentStudySession ?? null);
            setLoadingRecentStudySession(false);
            setRecentStudyError(null);
        },  
        (error) => {
            console.error("Error fetching recent study session:", error);
            setRecentStudyError(error);
            setLoadingRecentStudySession(false);
        }
    );

    return unsubscribe;
    }, [user]);

    return { recentStudySession, loadingRecentStudySession, recentStudyError };
}