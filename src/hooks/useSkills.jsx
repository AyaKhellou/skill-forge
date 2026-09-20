import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useAuthContext } from "../AuthContext";
import { getGoalSkills, createSkill } from "../services/firestore";

export default function useSkills(goalId) {
    const [skills, setSkills] = useState(null);
    const [loadingSkills, setLoadingSkills] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId) {
            setSkills(null);
            setLoadingSkills(false);
            setError(null);
            return;
        }
        setLoadingSkills(true);
        setError(null);
        const unsubscribe = getGoalSkills(user.uid, goalId, (data) => {
            setSkills(data);
            setLoadingSkills(false);
        }, (error) => {
            setError(error);
            setLoadingSkills(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId]);
    
    const id = nanoid();
    const currentDate = new Date();


    async function addSkill(newSkillName) {
        await createSkill(user.uid, goalId, id, {
            id:id,
            name: newSkillName,
            status: false,
            createdAt:currentDate.toLocaleDateString()
        });
    }

    return { skills, loadingSkills, error, addSkill };
}