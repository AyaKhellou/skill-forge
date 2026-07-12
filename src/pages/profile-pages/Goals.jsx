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
        progress:"20%",
        skills: [
            {id:nanoid(), name:"Chords",status:false},
            {id:nanoid(), name:"Notes",status:true},
            {id:nanoid(), name:"Rythm",status:true},
        ]
    },
    { 
        id:nanoid(),
        goalName:"Learn web dev",
        progress:"80%",
        skills:[
            {id:nanoid(), name:"css",status:true},
            {id:nanoid(), name:"html",status:true},
            {id:nanoid(), name:"js",status:true}]
    }
])

    const pastelColors = [
        { name: "blush", color: "#fbebec" },
        { name: "peach", color: "#fcd3a7" },
        { name: "lilac", color: "#e7d4f9" },
        { name: "sage", color: "#dbecd7" },
        { name: "lemon", color: "#fdf0aa" },
        { name: "sky", color: "#dee7f6" },
    ]

    function addNewGoal(){
        setPopUp(true)
    }
    function saveGoal(){
        setPopUp(false)
        console.log("saved")
        setGoals(prev=> [...prev,{
            id:nanoid(),
            goalName:title,
            progress: "0%",
            skills:[]
        }])
        setTitle("")
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

console.log(goals)

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
                        progress={goal.progress}
                        color={pastelColors[index].color}
                        addNewSkill={addNewSkill}
                        toggleCheck={toggleCheck}
                        />
                    )
                })
            }
            </div>

            <Button 
            onClick={addNewGoal} 
            primary={true} 
            classes="fixed bottom-section right-section"
            disabled={!popUp}
            >Add new Goal</Button>

            {popUp &&
            <form className="bg-background border border-primary w-[90%] h-32 absolute top-[50%] left-section">
                <FormGroup 
                label="Goal's Title" 
                type="text" 
                name="title" 
                id="title" 
                value={title}
                onChange={e=> setTitle(e.target.value)}/>
                <Button
                onClick={saveGoal} 
                primary={false}
                disabled={!popUp}
                >Save Goal</Button>
            </form>}

        </section>
    )
}
