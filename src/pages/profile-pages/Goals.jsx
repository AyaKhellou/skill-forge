import Button from "../../components/Button"
import GoalCard from "../../components/GoalCard"
import { useState } from "react"
import FormGroup from "../../components/FormGroup";


export default function Goals(){
    const [popUp, setPopUp] = useState(false);
    const [title, setTitle] = useState("");

    let skills = [
        {name:"Chords",status:false, goal:"Learn the guitar"},
        {name:"Notes",status:true, goal:"Learn the guitar"},
        {name:"Rythm",status:true, goal:"Learn the guitar"},
        {name:"css",status:true, goal:"Learn web dev"},
        {name:"html",status:true, goal:"Learn web dev"},
        {name:"js",status:true, goal:"Learn web dev"}
    ]

    const [goals,setGoals] = useState([
    {   
        id:1,
        goalName:"Learn the guitar",
        progress:"20%",
        skills:skills.filter(skill=> skill.goal === "Learn the guitar")
    },
    { 
        id:2,
        goalName:"Learn web dev",
        progress:"80%",
        skills:skills.filter(skill=> skill.goal === "Learn web dev")
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
            id:5,
            goalName:title,
            progress: "0%",
            skills:[]
        }])
        setTitle("")
    }

    return(
        <section className="page relative">
            <h2>Current Goals</h2>
            <div className="goals flex gap-5">
            {
                goals.map((goal)=>{
                    return (
                        <GoalCard
                        key={goal.id}
                        goalName={goal.goalName} 
                        skills={goal.skills} 
                        progress={goal.progress} 
                        color={pastelColors[goal.id].color}/>
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
