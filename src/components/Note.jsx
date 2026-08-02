import { Pen, Trash } from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";


export default function Note({userId, goalId, skillId, noteId, title, timeCreated, content, setUpdateMode}){

    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId,"notes",noteId);
    
    function deleteNote(){
        async function deleteData(){
            try{
                await deleteDoc(docRef);
            }catch(err){
                console.log(err);
            }
        }
        deleteData()
    }
    function editNote(){
        setUpdateMode({title:title, content:content, noteId:noteId, timeCreated:timeCreated})
    }
    return(
        <div className="note flex flex-col justify-between gap-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm w-75 px-4 pt-4 pb-2">
            <div className="header flex items-center justify-between">
                <h3 className="text-lg text-text font-figtree font-semibold">{title}</h3>
                <button 
                className="cursor-pointer text-detail hover:text-lime-500"
                onClick={editNote}>
                    <Pen width={17} height={17}/>
                </button>
            </div>
            <div className="text-sm text-detail">{content.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
            <div className="flex items-center justify-between w-full">
                <span 
                className="text-xs text-detail">
                    {timeCreated}
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