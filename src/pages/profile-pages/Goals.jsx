import Button from "../../components/Button"
import GoalCard from "../../components/GoalCard"
import { useState, useEffect } from "react"
import FormGroup from "../../components/FormGroup";
import { nanoid } from "nanoid";


export default function Goals(){
    const [popUp, setPopUp] = useState(false);
    const [title, setTitle] = useState("");

    const [goals,setGoals] = useState([
    {   
        id:nanoid(),
        goalName:"Learn the guitar",
        skills: [
            {id:nanoid(), name:"Chords",status:false},
            {id:nanoid(), name:"Notes",status:false},
            {id:nanoid(), name:"Rythm",status:false},
        ]
    },
    { 
        id:nanoid(),
        goalName:"Learn web dev",
        skills:[
            {id:nanoid(), name:"css",status:false},
            {id:nanoid(), name:"html",status:false},
            {id:nanoid(), name:"js",status:false}]
    }
])

    function addNewGoal(){
        setPopUp(true)
    }
    function saveGoal(){
        if(title.trim() === ""){
            alert("Please enter a skill")
        }else{
        setPopUp(false)
        setGoals(prev=> [...prev,{
            id:nanoid(),
            goalName:title,
            skills:[]
        }])
        setTitle("")
    }
    }


function addNewSkill(newSkill,goalId){
        setGoals(prev => 
            prev.map(goal=>
                goal.id === goalId ?
                    {...goal,skills:[...goal.skills, newSkill]}
                :
                    goal
                
        )
        )
}
function toggleCheck(goalId,skillId){
    setGoals(prev => 
        prev.map(goal=>
            goal.id === goalId ?
                {...goal,skills:goal.skills.map(skill=>
                    skill.id === skillId ?
                    {...skill, status: !skill.status}
                    :
                    skill
                )}
            :
                goal
        )
    )
}

function editSkill(goalId,skillId,newSkillName){
    setGoals(prev => 
        prev.map(goal=>
            goal.id === goalId ?
                {...goal, skills: goal.skills.map(skill=>
                    skill.id === skillId ? 
                    {...skill, name:newSkillName} :
                    skill
                )} : goal
        )
    )
}

function deleteSkill(goalId,skillId){
    setGoals(prev => prev.map(goal=>
        goal.id === goalId ?
        {...goal, skills:goal.skills.filter(skill=> skill.id !== skillId)} :
        goal
    ))
}

    return(
        <section className="page relative">
            <h2>Current Goals</h2>
            <div className="goals flex flex-wrap gap-5">
            {
                goals.map((goal,index)=>{
                    return (
                        <GoalCard
                        key={goal.id}
                        goalId={goal.id}
                        goalName={goal.goalName} 
                        skills={goal.skills} 
                        addNewSkill={addNewSkill}
                        toggleCheck={toggleCheck}
                        editSkill={editSkill}
                        deleteSkill={deleteSkill}
                        />
                    )
                })
            }
            {popUp &&
            <form 
            className="rounded p-section min-w-80 flex flex-col bg-sage">
                <FormGroup 
                label="Goal's Title" 
                type="text" 
                name="title" 
                id="title" 
                value={title}
                onChange={e=> setTitle(e.target.value)}/>
                <Button
                classes="self-end mt-4"
                onClick={saveGoal} 
                primary={false}
                >Save Goal</Button>
            </form>}
            </div>

            <Button 
            onClick={addNewGoal} 
            primary={true} 
            disabled={popUp}
            classes={`fixed bottom-section right-section ${popUp && "cursor-not-allowed! bg-gray-200! text-gray-400! hover-none! border-transparent!"}`}
            >Add new Goal</Button>
        </section>
    )
}
