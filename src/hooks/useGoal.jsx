import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getGoal, updateGoal } from "../services/firestore";

export default function useGoal(goalId) {
    const [goalData, setGoalData] = useState(null);
    const [loadingGoal, setLoadingGoal] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId) {
            setGoalData(null);
            setLoadingGoal(false);
            setError(null);
            return;
        }
        setLoadingGoal(true);
        setError(null);
        const unsubscribe = getGoal(user.uid, goalId, (data) => {
            setGoalData(data);
            setLoadingGoal(false);
        }, (error) => {
            setError(error);
            setLoadingGoal(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId]);

    async function updateGoalData(dataToUpdate) {
        if (!user?.uid || !goalId) return;
        await updateGoal(user.uid, goalId, dataToUpdate);
    }

    return { goalData, loadingGoal, error, updateGoalData };
}