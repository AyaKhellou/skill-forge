import { Link, useParams } from "react-router-dom"
import { getUserskills, getUserGoal } from "../../firebase/firestore";
import { useAuthContext } from "../../authContext"
import { useState, useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"
import Loader from "../../components/Loader";
import Button from "../../components/Button"
import { Plus } from "lucide-react";
import Note from "../../components/Note";

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
                <h2>{goalData?.goalName}</h2>
                <ProgressBar progress={progress}/>
                <div className="details flex justify-between">
                    <span className="detail font-bold!">
                        {skills?.filter(skill=>skill.status === true).length}/{skills?.length} skills . {progress} %
                    </span>
                    <span className="study-hours">
                        total study time
                        10 hours
                    </span>
                </div>
            </div>
            <div className="bg-card-background shadow rounded p-section flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-text">skills</h3>
                <div className="skills">
                    {skills?.map(skill=>
                        <div className="skill border border-accent rounded my-2 p-3 shadow flex items-center justify-between skill-card"
                        key={skill.id}>
                            <Link>
                                <div className="flex items-center gap-4">
                                    <h4 className="text-xl text-accent font-figtree m-0">
                                        {skill.name}
                                    </h4>
                                    <span 
                                    className={`text-sm rounded-full p-1 ${skill.status ? "bg-sage" : "bg-peach"}`}
                                    >{skill.status ? "completed" : "pending"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="skill-details text-sm text-detail flex gap-4">
                                        <span>{skill.notes ? skill.notes.length : 0} notes</span>
                                        <span>{skill.projects ? skill.projects.length : 0} projects</span>
                                        <span>studied {skill.studyTimer ?? 0} hrs</span>
                                        <span>{skill.sources ? skill.sources.length : 0} sources</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
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