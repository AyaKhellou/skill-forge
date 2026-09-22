import { useState, useEffect, useRef } from "react";
import useNotes from "../../../hooks/useNotes";
import {emptyInput} from "../../../services/function";
import Button from "../../../components/Button";
import { useOutletContext } from "react-router-dom";
import useSkill from "../../../hooks/useSkill";
import Note from "../../../components/Note";
import Loader from "../../../components/Loader";

export default function Notes(){

    const [updateMode, setUpdateMode] = useState(null)
    const [noteTitle, setNoteTitle] = useState("")
    const [noteContent, setNoteContent] = useState("")
    
    const contentInputRef = useRef(null);

    const { skillId, goalId } = useOutletContext();

    const { notes, loadingNotes, error, createNewNote, editNote, deleteCurrentNote } = useNotes(goalId, skillId);
    const { updateSkillData } = useSkill(goalId, skillId);


    async function saveNote(){
        const trimmedNoteTitle = noteTitle.trim();
        const trimmedNoteContent = noteContent.trim();

        if(!trimmedNoteTitle || !trimmedNoteContent){
            await emptyInput("Note title and content cannot be empty");
            return;
        }

        try{
            await createNewNote(trimmedNoteTitle, trimmedNoteContent);
            setNoteTitle("")
            setNoteContent("")
        } catch(err){
            console.log(err);
        }
    }
    
    useEffect(()=>{
        if(updateMode){
            setNoteTitle(updateMode.title)
            setNoteContent(updateMode.content)
            contentInputRef.current?.focus();
        }
    }, [updateMode])

    async function updateNote(){
        const trimmedNoteTitle = noteTitle.trim();
        const trimmedNoteContent = noteContent.trim();

        if(!trimmedNoteTitle || !trimmedNoteContent){
            await emptyInput("Note title and content cannot be empty");
            return;
        }
        try{
            await editNote(updateMode.noteId, {
                title: trimmedNoteTitle,
                content: trimmedNoteContent
            });
            
            setNoteTitle("")
            setNoteContent("")
            setUpdateMode(null)
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        async function updateSkill(){
            try{
                await updateSkillData({
                    notesCount:notes.length
                });

            }catch(err){
                console.log(err);
            }
        }
        updateSkill();
    },[notes])

    if(loadingNotes){
        return(
            <div className="bg-card-background shadow rounded p-section flex flex-col items-center">
                <Loader/>
            </div>
        )
    }
    return(
        <>
        <div className="bg-card-background shadow rounded p-section flex flex-col">
            <div className="note w-full border-b border-accent gap-3 mb-3">
                <input 
                type="text" 
                name="note-title" 
                className="bg-background shadow w-full p-4 outline-none font-figtree font-semibold text-2xl mb-2"
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e)=> setNoteTitle(e.target.value)}
                />
                <textarea 
                ref={contentInputRef}
                className="bg-background shadow w-full h-52 p-4 outline-none font-figtree"
                name="note-body"
                placeholder="Note Content"
                value={noteContent}
                onChange={(e)=> setNoteContent(e.target.value)}
                />
            </div>
                {
                updateMode?
                <Button 
                classes="self-end"
                onClick={updateNote}>Update Note</Button>
                :
                <Button 
                classes="self-end"
                onClick={saveNote}>Save Note</Button>
                }
        </div>
        <div className="bg-card-background shadow rounded p-section grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notes?.length !== 0 && notes ?
                error ?
                <p>{error}</p>
                :
                notes.map((note)=>{
                    return <Note 
                    key={note.id}
                    note={note}
                    setUpdateMode={setUpdateMode}
                    onDelete={deleteCurrentNote}
                    />
                })
                :
                <p>no notes!</p>
                }
            </div>
        </>
    )
}