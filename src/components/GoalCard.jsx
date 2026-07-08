import SkillCard from "../components/SkillCard"
import ProgressBar from "../components/ProgressBar"
import { Plus } from "lucide-react"


export default function GoalCard({goalName, skills, progress, color}){
    function addNewSkill(){
        console.log("add new skill")
    }
    return(
        <div className={`rounded p-section w-1/3`}
        style={{ backgroundColor: color }}>
            <h3 className="card-title font-figtree text-xl font-semibold text-text">{goalName}</h3>
            <ProgressBar width={progress}/>
            <div className="skills">
                {skills.map((skill,index)=>{
                    return <SkillCard key={index} status={skill.status} name={skill.name}/>
                })}
            </div>
            <div className="flex items-center">
                <input type="text" name="skill" 
                className="outline-none border-b-2 border-border-color focus:border-detail w-full" />
                <button onClick={addNewSkill} className="cursor-pointer text-border-color hover:text-detail">
                    <Plus width={20} className=""/>
                </button>
            </div>
        </div>
    )
}