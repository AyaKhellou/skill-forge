import Button from "../../components/Button"
import GoalCard from "../../components/GoalCard"
import { useState } from "react"
import useTheme from "../../hooks/useTheme";
import useGoals from "../../hooks/useGoals";
import { useNavigate } from "react-router-dom";
import goalIconLightMode from "../../assets/goal-light-mode.png"
import goalIconDarkMode from "../../assets/goal-dark-mode.png"
import LoadingData from "../../components/LoadingData";
import { emptyInput } from "../../services/function";

export default function Goals(){
    const [title, setTitle] = useState("");

    const { goals, loadingGoals,error, addGoal } = useGoals();

    const navigate = useNavigate();

    const { mode } = useTheme();


    async function saveGoal(e){
        e.preventDefault();
        if(title.trim() === ""){
            emptyInput('Please enter a goal first.')
        }else{
            try{
                const goal = await addGoal(title.trim());           
                setTitle("")
                navigate(`/user/goals/${goal?.id}`)
            } catch (error) {
                console.error("Error adding goal:", error);
            }
        }
    }

    return(
        <section className="page relative">
            <div className="bg-card-background shadow rounded p-section mb-3">
                <h2>
                    My Goals
                    {
                        mode === "dark mode" ? 
                        <img src={goalIconDarkMode} alt="goal icon" className="inline w-7 h-7 ml-2"/>
                        :
                        <img src={goalIconLightMode} alt="goal icon" className="inline w-7 h-7 ml-2"/>
                    }
                </h2>
                    <div className="flex justify-between items-center">
                        <span className="detail">
                            finished {goals?.filter(goal=>goal.status === "completed").length}/{goals?.length} goals
                        </span>
                    </div>
            </div>
            <form 
                className="flex flex-col rounded p-section bg-card-background border border-accent shadow mb-3"
                onSubmit={saveGoal}>
                    <input 
                    type="text"
                    name="title" 
                    id="title"
                    placeholder="Goal's Title"
                    className="bg-background border border-detail rounded-md p-2 outline-none focus:border-accent main-transition w-full"
                    value={title}
                    onChange={e=> setTitle(e.target.value)}
                    />
                    <Button
                    classes="self-end mt-4"
                    onClick={saveGoal} 
                    primary={false}
                    >add new Goal</Button>
                </form>
                {
                    error ?
                    <div className="flex bg-background">
                        <div className="w-full h-screen flex items-start justify-center p-section">
                            <p className="text-red! text-lg">{error.message}</p>
                        </div>
                    </div>
                    :
                    loadingGoals ?
                    <LoadingData message="Loading Goals..."/>
                    : !goals || goals.length === 0 ?
                    <div className="flex flex-col items-center justify-center gap-3 mt-5">
                        <h3 className="text-text font-semibold text-lg">No Goals Yet !</h3>
                        <p className="text-detail text-sm">Add a new goal to get started</p>
                    </div>
                    :
                    <div className="goals grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {
                        goals.map((goal)=>{
                            return (
                                <GoalCard
                                key={goal.id}
                                goalId={goal.id}
                                goalName={goal.goalName} 
                                />
                            )
                        })
                    }
                    </div>
                }
        </section>
    )
}
