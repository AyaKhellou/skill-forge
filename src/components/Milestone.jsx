import { Check, Pen, Trash } from "lucide-react"
import CheckBox from "./CheckBox"
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useRef, useState } from "react";

export default function Milestone({checkVal,milestoneVal, userId, goalId, skillId,milestoneId}){
    const inputRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const [editedMilestoneValue, setEditedMilestoneValue] = useState(milestoneVal)
    const docRef = doc(db, "users", userId, "goals",goalId,"skills",skillId,"milestones",milestoneId);

    async function updateMilestone(dataToUpdate){
        try{
            await updateDoc(docRef, dataToUpdate);
        }catch(err){
            console.log(err);
        }
    }
        
    function deleteMilestone(){
        async function deleteData(){
            try{
                await deleteDoc(docRef);
            }catch(err){
                console.log(err);
            }
        }
        deleteData()
    }

    function startEditMode(){
        setEditMode(true)
        console.log(milestoneVal);
    }
    
    useEffect(()=>{
        console.log(inputRef.current);
        inputRef.current?.focus();
    },[editMode])

    function editMilestone(){
        setEditMode(false)
        console.log(editedMilestoneValue);
        updateMilestone({name:editedMilestoneValue})
        console.log(inputRef.current);

    }

    function toggleCheck(){
        updateMilestone({status: !checkVal})
    }

    return(
        <div className="bg-background border-b border-accent flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
                <CheckBox checked={checkVal} toggleCheck={toggleCheck}/>
                {editMode?
                <input 
                type="text" 
                value={editedMilestoneValue} 
                onChange={(e)=>setEditedMilestoneValue(e.target.value)}
                ref={inputRef} />
                :
                <p>{milestoneVal}</p>
                }
            </div>
            <div className="flex gap-3">
                <button 
                className="cursor-pointer"
                onClick={deleteMilestone}>
                    <Trash width={17} />
                </button>
                {editMode?
                    <button 
                    className="cursor-pointer"
                    onClick={editMilestone}>
                        <Check width={17} />
                    </button>
                    :
                    <button 
                    className="cursor-pointer"
                    onClick={startEditMode}>
                        <Pen width={17} />
                    </button>
                }
            </div>
        </div>
    )
}