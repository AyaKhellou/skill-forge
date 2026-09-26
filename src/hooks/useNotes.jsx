import { useEffect, useState } from "react";
import { useAuthContext } from "../AuthContext";
import { getSkillNotes, createNote, deleteNote, updateNote } from "../services/firestore";
import { nanoid } from "nanoid";

export default function useNotes(goalId, skillId) {

    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [error, setError] = useState(null);


    const { user } = useAuthContext();


    useEffect(() => {
        if (!user?.uid || !goalId || !skillId) {
            setNotes([]);
            setLoadingNotes(false);
            setError(null);
            return;
        }
        setLoadingNotes(true);
        setError(null);
        const unsubscribe = getSkillNotes(user.uid, goalId, skillId, (data) => {
            setNotes(data);
            setLoadingNotes(false);
        }, (error) => {
            setError(error);
            setLoadingNotes(false);
        })
        return unsubscribe;
    }, [user?.uid, goalId, skillId]);


    async function createNewNote(noteName, noteContent){
        const id = nanoid();
        const now = new Date();
        if (!user?.uid || !goalId || !skillId) return;
        await createNote(user.uid, goalId, skillId, id, {
            id:id,
            title: noteName,
            content: noteContent,
            createdAt: now.toLocaleDateString(),
        });
    }
    
    async function editNote(noteId, dataToUpdate){
        if (!user?.uid || !goalId || !skillId || !noteId) return;
        await updateNote(user.uid, goalId, skillId, noteId, dataToUpdate);
    }

    async function deleteCurrentNote(noteId){
        if (!user?.uid || !goalId || !skillId || !noteId) return;
        await deleteNote(user.uid, goalId, skillId, noteId);
    }

    return { notes, loadingNotes, error, createNewNote, editNote, deleteCurrentNote };
}