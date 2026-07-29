import { Link, useParams } from "react-router-dom"
import { getUserskills, getUserGoal } from "../../firebase/firestore";
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader";
import Button from "../../components/Button"
import { ArrowLeft } from "lucide-react";
import Note from "../../components/Note";
import DetailedSkillCard from "../../components/DetailedSkillCard";

export default function Goal(){
    const { goal } = useParams();
    const { user } = useAuthContext();
    const[goalData,setGoalData] = useState(null)
    const [skills, setSkills] = useState(null)
    

    const loading = goalData === null || skills === null;

    const progress  =
        skills?.length === 0 ?
        0:
        Math.round((100 * skills?.filter(skill=> skill.status === true).length) / skills?.length)

    
    useEffect(()=>{
        async function fetchData() {
            const goalInfo = await getUserGoal(user.uid,goal)
            setGoalData(goalInfo)

            const skillsInfo = await getUserskills(user?.uid,goalData?.id)
            setSkills(skillsInfo)
        }
        fetchData();
    },[user,goal,goalData?.id])
    
    

    if(loading){
        return (
            <section className="page">
                <Loader/>
            </section>
        )
    }

    if(!loading){
    return (
        <section className="page flex flex-col gap-3">
            <div 
            className="bg-card-background shadow rounded p-section">
                {/* <div className="flex items-center gap-3"> */}
                    <Link to=".." relative="path" className="text-blue-500 flex items-center gap-2 my-3">
                        <ArrowLeft width={17}/>
                        <p>go back to goals</p>
                    </Link>
                {/* </div> */}
                <h2>{goalData?.goalName}</h2>
                <ProgressBar progress={progress}/>
                <div className="details flex justify-between">
                    <span className="detail font-bold!">
                        {skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %
                    </span>
                    <span className="detail study-hours">
                        total study time
                        10 hours
                    </span>
                </div>
            </div>
            <div className="rounded flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <div className="skills">
                    {skills?.map(skill=>
                        <DetailedSkillCard 
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        status={skill.status}/>
                    )}
                </div>
                <Button classes="self-end mt-4">
                    add new skill
                </Button>
            </div>
            <div className="bg-card-background shadow rounded p-section flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">Notes</h3>
                <div className="notes">
                    <Note name="study plan" tags={["html","css"]} timeCreated="21 jun" 
                    text="stydy html everyday"/>
                </div>
                <Button classes="self-end">
                    add note
                </Button>
            </div>
        </section>
    )
    }
}