import { useAuthContext } from "../AuthContext";
import useGoals from "./useGoals";
import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase-config"; 

export default function useAllSkills() {
    const [allSkills, setAllSkills] = useState([]);
    const [loadingAllSkills, setLoadingAllSkills] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuthContext();
    const { goals } = useGoals();
    const skillsByGoal = {};

    useEffect(()=>{
        if (!goals || !user) return;
        setLoadingAllSkills(true);

        const unsubscribes = goals.map(goal=>{
            return onSnapshot(
                collection(db, "users", user.uid, "goals", goal.id, "skills"), (snapshot) => {
                const skillsList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    goalId:goal.id,
                    ...doc.data()
                }));
                skillsByGoal[goal.id] = skillsList;
                setAllSkills(Object.values(skillsByGoal).flat())
                setLoadingAllSkills(false);
            },
            (error) => {
                console.error("Error fetching skills: ", error);
                setError(error);
            }
            );
        })
        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
        
    },[goals,user])

    return { allSkills, loadingAllSkills, error };
}