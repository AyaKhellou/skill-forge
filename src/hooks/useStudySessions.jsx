import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getSkillStudySessions, createStudySession, deleteStudySession, updateStudySession } from "../services/firestore";
import { nanoid } from "nanoid";

export default function useStudySessions(goalId, skillId) {

    const [studySessions, setStudySessions] = useState([]);
    const [loadingStudySessions, setLoadingStudySessions] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId || !skillId) {
            setStudySessions([]);
            setLoadingStudySessions(false);
            setError(null);
            return;
        }
        setLoadingStudySessions(true);
        setError(null);
        const unsubscribe = getSkillStudySessions(user.uid, goalId, skillId, (data) => {
            setStudySessions(data);
            setLoadingStudySessions(false);
        }, (error) => {
            setError(error);
            setLoadingStudySessions(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId, skillId]);


    async function createNewStudySession(sessionTitle, time, todaysGoal){
        const id = nanoid();
        if (!user?.uid || !goalId || !skillId) return;
        await createStudySession(user.uid, goalId, skillId, id, {
            id:id,
            name: sessionTitle,
            duration: time,
            focus: todaysGoal,
            date: new Date().toLocaleDateString()
        });
    }
    
    // async function editResource(resourceId, dataToUpdate){
    //     if (!user?.uid || !goalId || !skillId || !resourceId) return;
    //     await updateResource(user.uid, goalId, skillId, resourceId, dataToUpdate);
    // }

    // async function deleteCurrentResource(resourceId){
    //     if (!user?.uid || !goalId || !skillId || !resourceId) return;
    //     await deleteResource(user.uid, goalId, skillId, resourceId);
    // }

    return { studySessions, loadingStudySessions, error, createNewStudySession };
}