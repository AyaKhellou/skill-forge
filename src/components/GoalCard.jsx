import SkillCard from "../components/SkillCard"
import ProgressBar from "../components/ProgressBar"
import { Plus, Pen } from "lucide-react"
import { useState } from "react"
import { nanoid } from "nanoid"



export default function GoalCard({goalName, skills, color, addNewSkill, goalId,goal,toggleCheck}){
    const [newSkill, setNewSkill] = useState("")

    const progress  = 
        skills.length === 0 ?
        0:
        Math.round((100 * skills.filter(skill=> skill.status === true).length) / skills.length)
    
    
    function assignSkill(){
        if(newSkill.trim() === ""){
            throw new Error("write something!")
        }else{
            addNewSkill({id:nanoid(), name:newSkill , status:false},goalId)
            setNewSkill("")
        }
    }

    return(
            <div className={`rounded p-section min-w-80`}
            style={{ backgroundColor: color }}>
                <h3 className="card-title font-figtree text-xl font-semibold text-text">{goalName}</h3>
                <ProgressBar progress={progress}/>
                <div className="skills">
                    {skills.map((skill,index)=>{
                        return <SkillCard 
                        key={index} 
                        status={skill.status} 
                        name={skill.name}
                        toggleCheck={()=>toggleCheck(goalId,skill.id)}/>
                    })}
                </div>
                <div className="flex items-center">
                    <input type="text" name="skill" 
                    value={newSkill}
                    onChange={e=> setNewSkill(e.target.value)}
                    className="outline-none border-b-2 border-border-color focus:border-detail w-full" />
                    <button 
                    type="button"
                    onClick={assignSkill} 
                    className="cursor-pointer text-border-color hover:text-detail">
                        <Plus width={20}/>
                    </button>
                </div>
            </div>
    )
}