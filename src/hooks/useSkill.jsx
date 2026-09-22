import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { deleteSkill } from "../services/firestore";

export default function useSkill(goalId, skillId) {

    const [skillData, setSkillData] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    // useEffect(() => {
    //     if (!user?.uid || !skillId) {
    //         setSkillData(null);
    //         setLoadingSkill(false);
    //         setError(null);
    //         return;
    //     }
    //     setLoadingSkill(true);
    //     setError(null);
    //     const unsubscribe = getSkill(user.uid, skillId, (data) => {
    //         setSkillData(data);
    //         setLoadingSkill(false);
    //     }, (error) => {
    //         setError(error);
    //         setLoadingSkill(false);
    //     })
    //     return unsubscribe;
    // }, [user?.uid, skillId]);

    // async function updateSkillData(dataToUpdate) {
    //     if (!user?.uid || !skillId) return;
    //     await updateSkill(user.uid, skillId, dataToUpdate);
    // }

    async function deleteSkillData() {
        if (!user?.uid || !goalId || !skillId ) return;
        await deleteSkill(user.uid, goalId, skillId);
    }

    return { /*skillData, loadingSkill, error, updateSkillData,*/ deleteSkillData };
}