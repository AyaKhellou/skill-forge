import { Link } from "react-router-dom"
import ProgressBar from "./ProgressBar"
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Trash } from "lucide-react";
import { secondsToTime } from "../services/function";
import { useAuthContext } from "../AuthContext";
export default function DetailedSkillCard({skill, goalId}){

    const { user } = useAuthContext();
    const userId = user?.uid;

    function deleteSkill(){
        const docRef = doc(db, "users", userId, "goals",goalId, "skills",skill.id);

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
        <div className="bg-background rounded my-3 p-3 shadow flex items-center gap-4">
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