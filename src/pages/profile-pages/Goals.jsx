import Button from "../../components/Button"
import GoalCard from "../../components/GoalCard"
import { useState, useEffect } from "react"
import FormGroup from "../../components/FormGroup";
import { nanoid } from "nanoid";
import { createGoal, getUserGoals } from "../../firebase/firestore"
import { useAuthContext } from "../../authContext";



export default function Goals(){
    const { user } = useAuthContext();
    const [popUp, setPopUp] = useState(false);
    const [title, setTitle] = useState("");
    const [goals,setGoals] = useState(null);


    useEffect(()=>{
        if(!user) return;
        if(user){
            getUserGoals(user.uid)
            .then(goals => setGoals(goals))
        }
    },[user,goals])
    

    function addNewGoal(){
        setPopUp(true)
    }
    function saveGoal(){
        if(title.trim() === ""){
            alert("Please enter a skill")
        }else{
        setPopUp(false)

        if (!user) return;
        if(user){
            console.log(user.uid);
            const goalId = nanoid();
            createGoal(user.uid,{
                id:goalId,
                goalName:title
            },goalId)
        }
        setTitle("")
    }
    }


    return(
        <section className="page relative">
            <div className="bg-card-background shadow rounded p-section mb-3">
                <h2>Current Goals</h2>
                    <span className="detail font-bold!">
                        finished {goals?.filter(goal=>goal.status === true).length}/{goals?.length} goals
                    </span>
            </div>
            <div className="goals flex flex-wrap gap-5">
            {
                goals?.map((goal)=>{
                    return (
                        <GoalCard
                        key={goal.id}
                        goalId={goal.id}
                        goalName={goal.goalName} 
                        skills={goal.skills}
                        userId={user.uid}
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
