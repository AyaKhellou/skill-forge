import SkillCard from "../components/SkillCard"
import ProgressBar from "../components/ProgressBar"
import { Plus,Pen } from "lucide-react"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import { Link } from "react-router-dom"
import { createSkill,getUserskills,updateGoal } from "../firebase/firestore"





export default function GoalCard({
    goalName, goalId, userId
}){

    const [newSkill, setNewSkill] = useState("")
    const [skills,setSkills] = useState(null)
    const [editMode, setEditMode] = useState(false)

    useEffect(()=>{
        if(!userId) return;
        if(userId){
            getUserskills(userId,goalId)
            .then(skills => setSkills(skills))
        }
    },[skills,goalId,userId])

    const progress  = 
        skills?.length === 0 ?
        0:
        Math.round((100 * skills?.filter(skill=> skill.status === true).length) / skills?.length)
    
    
    function assignSkill(){
        if(newSkill.trim() === ""){
            alert("Please enter a skill")
        }else{
            if(!userId) return;
            if(userId){
                const skillId = nanoid();
                const data = {
                    id: skillId,
                    name:newSkill,
                    status: false
                }
                createSkill(userId,data,goalId,skillId)
                setNewSkill("")
            }
        }
    }

    // function changeTitle(){
    //     updateGoal(userId, goalId, {name})
    // }

    return(
            <div className={`rounded p-section min-w-80 bg-lemon`}>
                {/* {
                    editMode?
                    <input/>
                    : */}
                    <div className="title flex justify-between">
                    <Link to={`${goalName}`}>
                        <h3 className="card-title font-figtree text-xl font-semibold text-text">{goalName}</h3>
                    </Link>
                    <button 
                    type="button"
                    // onClick={changeTitle}
                    >
                        <Pen width={20}/>
                    </button>
                </div>
                {/* } */}
                <ProgressBar progress={progress}/>
                <div className="skills">
                    {skills?.map((skill)=>{
                        return <SkillCard 
                        key={skill.id} 
                        status={skill.status} 
                        name={skill.name}
                        goal={goalName}
                        goalId={goalId}
                        skillId={skill.id}
                        userId={userId}
                        />
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