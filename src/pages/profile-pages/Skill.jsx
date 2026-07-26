import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { ArrowLeft } from "lucide-react";
import { getSkill } from "../../firebase/firestore"
import { useAuthContext } from "../../authContext";
import ProgressBar from "../../components/ProgressBar";

export default function Skill(){
    const { user } = useAuthContext();
    const[loading, setLoading] = useState(true)
    const[skillData, setSkillData] = useState(null)

    const { goal, skill } = useParams()
    console.log("goal: ",goal);
    console.log("skill: ",skill);
    console.log("user: ",user);


    useEffect(()=>{
        async function fetchData() {
            const skillData = await getSkill(user.uid,goal,skill)
            setSkillData(skillData)
            setLoading(false)
        }
        fetchData();
    },[user,goal,skill])

    console.log(skillData);
    
    
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
                <Link to={`/user/goals/${goal}`} className="text-blue-500 flex items-center gap-2 my-3">
                    <ArrowLeft width={17}/>
                    <p>go back</p>
                </Link>
                <h2>{skillData.name}</h2>
                <span 
                    className={`text-sm rounded-full p-1 ${skillData.status ? "bg-sage" : "bg-peach"}`}
                >{skillData.status ? "completed" : "pending"}
                </span>
                <ProgressBar/>
            </div>
            <div className="nav-bar bg-card-background shadow p-section flex justify-around">
                <NavLink to="" end className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Milestones</NavLink>
                <NavLink to="notes" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Notes</NavLink>
                <NavLink to="resourses" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Resources</NavLink>
                <NavLink to="projects" className={ ({isActive}) => isActive? "text-accent font-bold": ""}>Projects</NavLink>
                {/* <NavLink to="study-sessions">Study Sessions</NavLink> */}
            </div>
            <Outlet/>
        </section>
    )
    }
}