import { Pen, Trash } from "lucide-react";
import { deleteWarning } from "../services/function";


export default function Note({
    note, setUpdateMode, onDelete
}){
    
    async function deleteNote(){
        const result = await deleteWarning("note")
        if(!result) return;
        try{
            await onDelete(note.id);
        }catch(err){
            console.log(err);
        }
    }
    function editNote(){
        setUpdateMode({title:note.title, content:note.content, noteId:note.id, timeCreated:note.createdAt})
    }
    return(
        <div className="note flex flex-col justify-between gap-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm w-full px-4 pt-4 pb-2">
            <div className="header flex items-center justify-between">
                <h3 className="text-lg text-text font-figtree font-semibold">{note.title}</h3>
                <button 
                className="cursor-pointer text-detail hover:text-lime-500"
                onClick={editNote}>
                    <Pen width={17} height={17}/>
                </button>
            </div>
            <div className="text-sm text-detail">{note.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
            <div className="flex items-center justify-between w-full">
                <span 
                className="text-xs text-detail">
                    {note.createdAt}
                </span>
                <button 
                className="cursor-pointer text-detail hover:text-red"
                onClick={deleteNote}>
                    <Trash width={17} height={17}/>
                </button>
            </div>
        </div>
    )
}