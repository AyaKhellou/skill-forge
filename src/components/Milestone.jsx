import { Pen, Trash } from "lucide-react"
import CheckBox from "./CheckBox"
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Milestone({checkVal,milestoneVal, userId, goalId, skillId,milestoneId}){
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

    function editMilestone(){
        
    }

    function toggleCheck(){
        updateMilestone({status: !checkVal})
    }

    return(
        <div className="bg-background border-b border-accent flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
                <CheckBox checked={checkVal} toggleCheck={toggleCheck}/>
                <p>{milestoneVal}</p>
            </div>
            <div className="flex gap-3">
                <button 
                className="cursor-pointer"
                onClick={deleteMilestone}>
                    <Trash width={17} />
                </button>
                <button 
                className="cursor-pointer"
                onClick={editMilestone}>
                    <Pen width={17} />
                </button>
            </div>
        </div>
    )
}