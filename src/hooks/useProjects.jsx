import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getGoalProjects, createProject } from "../services/firestore";
import { nanoid } from "nanoid";
import { uploadImage } from "../services/function";

export default function useProjects(goalId) {
    const [projects, setProjects] = useState(null);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId) {
            setProjects(null);
            setLoadingProjects(false);
            setError(null);
            return;
        }
        setLoadingProjects(true);
        setError(null);
        const unsubscribe = getGoalProjects(user.uid, goalId, (data) => {
            setProjects(data);
            setLoadingProjects(false);
        }, (error) => {
            setError(error);
            setLoadingProjects(false);
        })
        return unsubscribe;

    }, [user?.uid, goalId]);


    async function addProject(imagePath, projectName, projectDesc) {
        if (!user?.uid || !goalId) return;
        const currentDate = new Date();
        const id = nanoid();
        const imageUrl =  await uploadImage(imagePath)
        await createProject(user.uid, goalId, id, {
            id:id,
            imageUrl:imageUrl,
            name: projectName,
            briefDescription:projectDesc,
            createdAt:currentDate.toLocaleDateString(),
        });
    }

    return { projects, loadingProjects, error, addProject };
}