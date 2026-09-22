import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getSkillMilestones, createMilestone, deleteMilestone, updateMilestone } from "../services/firestore";
import { nanoid } from "nanoid";

export default function useMilestones(goalId, skillId) {

    const [milestones, setMilestones] = useState([]);
    const [loadingMilestones, setLoadingMilestones] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId || !skillId) {
            setMilestones([]);
            setLoadingMilestones(false);
            setError(null);
            return;
        }
        setLoadingMilestones(true);
        setError(null);
        const unsubscribe = getSkillMilestones(user.uid, goalId, skillId, (data) => {
            setMilestones(data);
            setLoadingMilestones(false);
        }, (error) => {
            setError(error);
            setLoadingMilestones(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId, skillId]);


    async function addMilestone(milestoneName){
        const id = nanoid();
        const now = new Date();
        if (!user?.uid || !goalId || !skillId) return;
        await createMilestone(user.uid, goalId, skillId, id, {
            id:id,
            name: milestoneName,
            status:false,
            startedAt: now.toLocaleDateString() 
        });
    }

    async function editMilestone(milestoneId, dataToUpdate){
        if (!user?.uid || !goalId || !skillId || !milestoneId) return;
        await updateMilestone(user.uid, goalId, skillId, milestoneId, dataToUpdate);
    }

    async function deleteCurrentMilestone(milestoneId){
        if (!user?.uid || !goalId || !skillId || !milestoneId) return;
        await deleteMilestone(user.uid, goalId, skillId, milestoneId);
    }

    return { milestones, loadingMilestones, error, addMilestone, editMilestone, deleteCurrentMilestone };
}