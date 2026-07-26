import ProgressBar from "../components/ProgressBar"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserskills } from "../firebase/firestore"

export default function GoalCard({
    goalName, goalId, userId
}){
    const [skills,setSkills] = useState(null)

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

    return(
            <div className={`rounded p-section w-96 min-w-80 bg-card-background border border-accent shadow`}>
                <div className="header flex items-center justify-between">
                    <Link to={`${goalId}`}>
                        <h3 className="card-title font-figtree text-xl font-semibold text-text">{goalName}</h3>
                    </Link>
                </div>
                <ProgressBar progress={progress}/>
                <div className="">
                    {skills?.map((skill)=>{
                        return <span 
                        key={skill.id} 
                        className={`bg-[#D6D6D6] p-2 rounded-full text-[12px] mx-1 ${skill.status ? "bg-sage": "bg-peach"}`}
                        >{skill.name}</span>
                    })}
                </div>
            </div>
    )
}