import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { deleteProject, getProject, updateProject } from "../services/firestore";

export default function useProject(goalId, projectId) {

    const [projectData, setProjectData] = useState(null);
    const [loadingProject, setLoadingProject] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuthContext();

    useEffect(() => {
        if (!user?.uid || !goalId || !projectId) {
            setProjectData(null);
            setLoadingProject(false);
            setError(null);
            return;
        }

        setLoadingProject(true);
        setError(null);
        const unsubscribe = getProject(user.uid, goalId, projectId, (data) => {
            setProjectData(data);
            setLoadingProject(false);
        }, (error) => {
            setError(error);
            setLoadingProject(false);
        });
        return unsubscribe;
    }, [user?.uid, goalId, projectId]);
    

    async function deleteProjectData() {
        if (!user?.uid || !goalId || !projectId ) return;
        await deleteProject(user.uid, goalId, projectId);
    }

    async function updateProjectData(dataToUpdate) {
        const currentDate = new Date();
        if (!user?.uid || !goalId || !projectId ) return;
        await updateProject(user.uid, goalId, projectId, {
            ...dataToUpdate,
            latestUpdate:currentDate.toLocaleString()
        });
    }

    return { projectData, loadingProject, error, deleteProjectData, updateProjectData };
}