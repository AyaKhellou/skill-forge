import { Check, Pen, Trash, X } from "lucide-react"
import CheckBox from "./CheckBox"
import { useEffect, useRef, useState } from "react";
import { deleteWarning, emptyInput } from "../services/function";

export default function Milestone({milestone, onEdit, onDelete}){
    
    const inputRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const [editedMilestoneValue, setEditedMilestoneValue] = useState(milestone.name)


    async function handleDeleteMilestone(){
        const result = await deleteWarning("milestone")
        if(!result) return;
        try{
            await onDelete(milestone.id);
        }catch(err){
            console.log(err);
        }
    }
    
    useEffect(()=>{
        inputRef.current?.focus();
    },[editMode])

    async function updateMilestone(){
        const milestoneName = editedMilestoneValue.trim();
        if(!milestoneName) {
            await emptyInput("Milestone name cannot be empty");
            return;
        }
        try{
            await onEdit(milestone.id, {name:milestoneName});
            setEditMode(false)
        }catch(err){
            console.log(err);
        }
    }

    async function toggleCheck(){
        try{
            await onEdit(milestone.id, {status: !milestone.status});
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="bg-background border-b border-accent flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
                <CheckBox checked={milestone.status} toggleCheck={toggleCheck}/>
                {editMode?
                <input 
                className="outline-none"
                type="text" 
                value={editedMilestoneValue} 
                onChange={(e)=>setEditedMilestoneValue(e.target.value)}
                ref={inputRef} />
                :
                <p>{milestone.name}</p>
                }
            </div>
            <div className="flex gap-3">
                <button 
                className="cursor-pointer"
                onClick={handleDeleteMilestone}>
                    <Trash width={17} />
                </button>
                {editMode?
                    <div className="flex gap-3">
                        <button 
                        className="cursor-pointer"
                        onClick={updateMilestone}>
                            <Check width={17} />
                        </button>
                        <button 
                        className="cursor-pointer"
                        onClick={()=>setEditMode(false)}>
                            <X width={17} />
                        </button>
                    </div>
                    :
                    <button 
                    className="cursor-pointer"
                    onClick={()=>setEditMode(true)}>
                        <Pen width={17} />
                    </button>
                }
            </div>
        </div>
    )
}