import { Link } from "react-router-dom"
import ProgressBar from "./ProgressBar"
import useSkill from "../hooks/useSkill";
import { Trash } from "lucide-react";
import { secondsToTime } from "../services/function";
import { deleteWarning } from "../services/function"

export default function DetailedSkillCard({skill, goalId}){

    const { deleteSkillData } = useSkill(goalId, skill.id);
    async function deleteSkill(){

        const result = await deleteWarning("skill");
        if (!result) return;
        try{
            await deleteSkillData();
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="bg-background rounded p-3 shadow flex items-center gap-4 w-full">
            <div className="w-full relative">
                <div className="flex items-center gap-4">
                    <button 
                    className="text-detail hover:text-red cursor-pointer"
                    onClick={deleteSkill} >
                        <Trash width={15} />
                    </button>
                    <Link to={`/user/goals/${goalId}/skills/${skill.id}`}>
                        <h4 className="text-xl text-accent font-figtree m-0!">
                            {skill.name}
                        </h4>
                    </Link>
                    <span 
                    className={`text-sm text-[#1F2937]! rounded-full p-1 ${skill.status ? "bg-sage" : "bg-peach"}`}
                    >{skill.status ? "completed" : "pending"}
                    </span>
                    
                </div>
                <ProgressBar progress={skill.progress}/>
                <div className="flex items-center flex-wrap text-sm text-detail gap-4">
                    <span>{skill?.notesCount ?? 0} {skill?.notesCount === 1 ?  "note" : "notes"}</span>
                    <span>{skill?.resourcesCount ?? 0} {skill?.resourcesCount === 1 ? "resource" : "resources"}</span>
                    <span>{skill?.milestonesCount ?? 0} {skill?.milestonesCount === 1 ? "milestone" : "milestones"}</span>
                    <span>{skill?.totalTimeStudied ? "studied for " + secondsToTime(skill.totalTimeStudied) : "not studied yet"} </span>
                </div>
            </div>
        </div>
    )
}