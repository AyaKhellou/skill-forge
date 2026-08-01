import { useState, useEffect } from "react";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection,doc,onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import Note from "../../../components/Note";

export default function Notes(){
    const [updateMode, setUpdateMode] = useState(false)
    const [notes, setNotes] = useState(null)
    const [noteTitle, setNoteTitle] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [loading, setLoading] = useState(true)
    
    const { skill, goal, userId } = useOutletContext();
    const now = new Date();
    const id = nanoid();

    //get data from firestore

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
        console.log("note title: ", noteTitle)
        console.log("note content: ", noteContent)
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
                className="w-full h-52 p-4 outline-none font-figtree"
                name="note-body"
                placeholder="Note Content"
                value={noteContent}
                onChange={(e)=> setNoteContent(e.target.value)}
                />
            </div>
                <Button 
                classes="self-end"
                onClick={saveNote}>save note</Button>
        </div>
        <div className="bg-card-background shadow rounded p-section flex gap-2">

                {notes?.length !== 0 && notes ?
                notes.map((note)=>{
                    return <Note 
                    title={note.title} 
                    timeCreated={note.createdAt} 
                    content={note.content.split('\n').map((line, i) => <p key={i}>{line}</p>)} />
                    // <div className="note w-full bg-background border-b border-accent gap-3 mb-3 p-4" key={note.id}>
                    //     <h3 className="font-figtree font-semibold text-xl">{note?.title}</h3> 
                    //     <p className="font-figtree text-detail">{note?.content.split('\n').slice(0,1)}</p>
                    // </div>
                })
                :
                <p>no notes!</p>
                }
            </div>
        </>
    )
    
}