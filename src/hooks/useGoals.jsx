import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useAuthContext } from "../AuthContext";
import { createGoal, getGoals } from "../services/firestore";

export default function useGoals() {
    const [goals, setGoals] = useState(null);
    const [loadingGoals, setLoadingGoals] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuthContext();

    useEffect(()=>{
        if(!user?.uid){
            setGoals(null);
            setLoadingGoals(false);
            setError(null);
            return;
        }

        setLoadingGoals(true);
        setError(null);
        
        const unsubscribe = getGoals(user.uid , (data)=>{
            setGoals(data)
            setLoadingGoals(false);
        }, (error)=>{
            setError(error);
            setLoadingGoals(false);
        })
        return unsubscribe;
    },[user?.uid])

    
    async function addGoal(title){
        const goalId = nanoid();
        if (!user) {
            throw new Error("User not authenticated");
        }
        const goal = {
            id: goalId,
            goalName: title
        };

        await createGoal(user.uid, goal, goalId)
        return goal;
    }
    

    return { goals, loadingGoals, error , addGoal };
}