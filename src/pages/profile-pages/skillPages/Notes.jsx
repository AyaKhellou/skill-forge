import { useState, useEffect, useRef } from "react";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection,doc,onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Note from "../../../components/Note";
import Loader from "../../../components/Loader";

export default function Notes(){
    const [updateMode, setUpdateMode] = useState(null)
    const [notes, setNotes] = useState(null)
    const [noteTitle, setNoteTitle] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [loading, setLoading] = useState(true)
    
    const contentInputRef = useRef(null);

    const { skill, goal, userId } = useOutletContext();
    const now = new Date();
    const id = nanoid();


    useEffect(() => {
        const notesRef = collection(db, "users", userId, "goals", goal, "skills", skill, "notes");
        onSnapshot(
            notesRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotes(data);
            setLoading(false);
        },
        (error) => {
            console.error("Error fetching notes: ", error);
            setLoading(false);
        }
        );
    }, [userId, goal, skill]);

    function saveNote(){
        async function createNote() {
            const docRef = doc(db, "users", userId, "goals",goal,"skills",skill,"notes",id);
            try{
                await setDoc(docRef, {
                    id:id,
                    title: noteTitle,
                    content: noteContent,
                    createdAt: now.toLocaleDateString()
                });
                console.log("note created!!!!!!!");
            } catch(err){
                console.log(err);
            }
        }
        createNote()
        setNoteTitle("")
        setNoteContent("")
    }
    
    useEffect(()=>{
        if(updateMode){
            setNoteTitle(updateMode.title)
            setNoteContent(updateMode.content)
            console.log("update mode is true");
            contentInputRef.current?.focus();
        }

    }, [updateMode])

    function updateNote(){
        const docRef = doc(db, "users", userId, "goals",goal,"skills",skill,"notes",updateMode.noteId);

        async function editNote(){
            try{
                await updateDoc(docRef, {
                    title: noteTitle,
                    content: noteContent
                });
            }catch(err){
                console.log(err);
            }
        }
        editNote()
        setNoteTitle("")
        setNoteContent("")
        setUpdateMode(null)
    }

    if(loading){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col">
                <Loader/>
            </div>
        )
    }
    return(
        <>
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="note w-full bg-background border-b border-accent gap-3 mb-3">
                <input 
                type="text" 
                name="note-title" 
                className="w-full p-4 outline-none font-figtree font-semibold text-2xl"
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e)=> setNoteTitle(e.target.value)}
                />
                <textarea 
                ref={contentInputRef}
                className="w-full h-52 p-4 outline-none font-figtree"
                name="note-body"
                placeholder="Note Content"
                value={noteContent}
                onChange={(e)=> setNoteContent(e.target.value)}
                />
            </div>
                {updateMode?
                <Button 
                classes="self-end"
                onClick={updateNote}>Update Note</Button>
                :
                <Button 
                classes="self-end"
                onClick={saveNote}>save note</Button>}
        </div>
        <div className="bg-card-background shadow rounded p-section flex gap-2">
                {notes?.length !== 0 && notes ?
                notes.map((note)=>{
                    return <Note 
                    key={note.id}
                    noteId={note.id}
                    skillId={skill}
                    goalId={goal}
                    userId={userId}
                    title={note.title} 
                    timeCreated={note.createdAt} 
                    content={note.content}
                    setUpdateMode={setUpdateMode}
                    />
                })
                :
                <p>no notes!</p>
                }
            </div>
        </>
    )
}