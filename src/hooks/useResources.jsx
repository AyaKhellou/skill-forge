import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getSkillResources, createResource, deleteResource, updateResource } from "../services/firestore";
import { nanoid } from "nanoid";

export default function useResources(goalId, skillId) {

    const [resources, setResources] = useState([]);
    const [loadingResources, setLoadingResources] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId || !skillId) {
            setResources([]);
            setLoadingResources(false);
            setError(null);
            return;
        }
        setLoadingResources(true);
        setError(null);
        const unsubscribe = getSkillResources(user.uid, goalId, skillId, (data) => {
            setResources(data);
            setLoadingResources(false);
        }, (error) => {
            setError(error);
            setLoadingResources(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId, skillId]);


    async function createNewResource(resourceName, resourceLink, resourceCategory){
        const id = nanoid();
        if (!user?.uid || !goalId || !skillId) return;
        await createResource(user.uid, goalId, skillId, id, {
            id:id,
            name: resourceName,
            link: resourceLink,
            category: resourceCategory,
        });
    }
    
    async function editResource(resourceId, dataToUpdate){
        if (!user?.uid || !goalId || !skillId || !resourceId) return;
        await updateResource(user.uid, goalId, skillId, resourceId, dataToUpdate);
    }

    async function deleteCurrentResource(resourceId){
        if (!user?.uid || !goalId || !skillId || !resourceId) return;
        await deleteResource(user.uid, goalId, skillId, resourceId);
    }

    return { resources, loadingResources, error, createNewResource, editResource, deleteCurrentResource };
}