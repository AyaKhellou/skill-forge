import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { deleteProject } from "../services/firestore";

export default function useProject(goalId, projectId) {

    const [projectData, setProjectData] = useState(null);
    const [loadingProject, setLoadingProject] = useState(true);
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

    async function deleteProjectData() {
        if (!user?.uid || !goalId || !projectId ) return;
        await deleteProject(user.uid, goalId, projectId);
    }

    return { /*projectData, loadingProject, error, updateProjectData,*/ deleteProjectData };
}