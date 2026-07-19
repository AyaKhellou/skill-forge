import { useParams } from "react-router-dom"
import { getUserskills, getUserGoal } from "../../firebase/firestore";
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";

export default function Goal(){
    const { goal } = useParams();
    const { user } = useAuthContext();
    const[goalData,setGoalData] = useState(null)
    const [skills, setSkills] = useState(null)

    useEffect(()=>{
        getUserGoal(user.uid,goal)
        .then(data=> setGoalData(data))
    },[user.uid,goal])

    useEffect(()=>{
        if(!goalData) return;
        if(goalData){
            getUserskills(user.uid,goalData?.id)
            .then(data=> setSkills(data))
        }
    },[user.uid,goalData])

    console.log(skills);
    


    return(
        <section>
            <h2>{goalData?.goalName}</h2>
            skills:
            {skills?.map(skill=>
                <div>
                    {skill.name} :
                    {skill.status? "finished" : "not yet"}
                </div>
            )}
        </section>
    )
}