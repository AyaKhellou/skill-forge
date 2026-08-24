import { Link } from "react-router-dom"
import { useState } from "react"
import ProgressBar from "./ProgressBar"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

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



    return(
        <div className="bg-background skill rounded my-2 p-3 shadow flex items-center gap-4 skill-card">
            <Link to={`skills/${id}`} className="w-full">
                <div className="flex items-center gap-4">
                    <h4 className="text-xl text-accent font-figtree m-0">
                        {name}
                    </h4>
                    <span 
                    className={`text-sm rounded-full p-1 ${status ? "bg-sage" : "bg-peach"}`}
                    >{status ? "completed" : "pending"}
                    </span>
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
            </Link>
        </div>
    )
}