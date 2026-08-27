import { Link } from "react-router-dom"
import { useState } from "react"
import ProgressBar from "./ProgressBar"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Trash } from "lucide-react";

export default function DetailedSkillCard({ id, name, status, progress,skill, userId, goalId}){

    const[notes,setNotes] = useState(null)
    const[studyTimer,setStudyTimer] = useState(null)
    const[sources,setSources] = useState(null)
    const[milestones,setMilestones] = useState(null)

    function secondsToTime(seconds){
        
    
        const totalMinutes = Math.floor(seconds / 60);
        
        const totalHours = Math.floor(totalMinutes / 60);
    
        const remainingSeconds = seconds % 60;

        const remainingMinutes = totalMinutes % 60;

        
        return`${totalHours <= 9 ? "0"+totalHours : totalHours}:${remainingMinutes <= 9 ? "0"+remainingMinutes : remainingMinutes}:${remainingSeconds <= 9 ? "0"+remainingSeconds : remainingSeconds}`;
    }


    function deleteSkill(){
        const docRef = doc(db, "users", userId, "goals",goalId, "skills",id);

        async function deleteData(){
            try{
                await deleteDoc(docRef);
            }catch(err){
                console.log(err);
            }
        }
        deleteData()
    }

    return(
        <div className="bg-background skill rounded my-2 p-3 shadow flex items-center gap-4 skill-card">
            <div className="w-full relative">
                <div className="flex items-center gap-4">
                    <Link to={`/user/goals/${goalId}/skills/${id}`}>
                        <h4 className="text-xl text-accent font-figtree m-0">
                            {name}
                        </h4>
                    </Link>
                    <span 
                    className={`text-sm text-[#1F2937]! rounded-full p-1 ${status ? "bg-sage" : "bg-peach"}`}
                    >{status ? "completed" : "pending"}
                    </span>
                    <button 
                    className="text-detail hover:text-red cursor-pointer"
                    onClick={deleteSkill} >
                        <Trash width={15} />
                    </button>
                </div>
                <ProgressBar progress={progress}/>
                <div className="flex items-center gap-4 mt-3">
                    <div className="skill-details text-sm text-detail flex gap-4">
                        <span>{skill?.notesCount ?? 0} {skill?.notesCount === 1 ?  "note" : "notes"}</span>
                        <span>{skill?.resourcesCount ?? 0} {skill?.resourcesCount === 1 ? "resource" : "resources"}</span>
                        <span>{skill?.milestonesCount ?? 0} {skill?.milestonesCount === 1 ? "milestone" : "milestones"}</span>
                        <span>{skill?.totalTimeStudied ? "studied for " + secondsToTime(skill.totalTimeStudied) : "not studied yet"} </span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}